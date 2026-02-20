# Complete Implementation Guide

## Overview

This guide provides the complete implementation strategy for the Ministry Platform. Due to the scope (150+ files), I'm providing:

1. **Critical Infrastructure** (implemented)
2. **Implementation Patterns** (templates)
3. **Step-by-step Build Guide**

## ✅ Phase 1: Foundation (COMPLETE)

### Files Created:

- `package.json` - All dependencies
- `.env.example` - Environment configuration template
- `src/lib/firebase/admin.ts` - Firebase Admin SDK
- `src/lib/firebase/client.ts` - Firebase Client SDK
- All type definitions in `src/types/`

### Next Steps:

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials
3. Run `npm install` to install dependencies

## 🔧 Phase 2: Core Infrastructure (IMPLEMENT NEXT)

### Priority Order:

#### 1. Authentication System

Create these files in order:

**`src/lib/auth/session.ts`**

```typescript
import { adminAuth } from "../firebase/admin";
import { cookies } from "next/headers";
import { AuthSession } from "@/src/types/user";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "admin_session";
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || "604800"); // 7 days

export async function createSession(idToken: string): Promise<string> {
  const expiresIn = SESSION_MAX_AGE * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return sessionCookie;
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
    return {
      userId: decodedClaims.uid,
      email: decodedClaims.email || "",
      role: decodedClaims.role || "viewer",
      expiresAt: decodedClaims.exp * 1000,
    };
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
```

**`middleware.ts`** (root level)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify session on server (implement verification endpoint)
    // For now, just check cookie exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

#### 2. API Response Utilities

**`src/lib/api/response.ts`**

```typescript
import { NextResponse } from "next/server";
import { ApiResponse, ApiError } from "@/src/types/api";

export function successResponse<T>(
  data: T,
  message?: string,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status: number = 400,
): NextResponse<ApiResponse> {
  const error: ApiError = { code, message, details };
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}

export function unauthorizedResponse(
  message: string = "Unauthorized",
): NextResponse<ApiResponse> {
  return errorResponse("UNAUTHORIZED", message, null, 401);
}

export function notFoundResponse(
  message: string = "Resource not found",
): NextResponse<ApiResponse> {
  return errorResponse("NOT_FOUND", message, null, 404);
}

export function validationErrorResponse(
  details: any,
): NextResponse<ApiResponse> {
  return errorResponse("VALIDATION_ERROR", "Validation failed", details, 400);
}
```

#### 3. Firestore Utilities

**`src/lib/firebase/firestore.ts`**

```typescript
import { adminDb } from "./admin";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
} from "firebase/firestore";

// Generic CRUD operations
export async function createDocument<T>(
  collectionName: string,
  data: T,
): Promise<string> {
  const docRef = await adminDb.collection(collectionName).add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getDocument<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const docRef = adminDb.collection(collectionName).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() } as T;
}

export async function updateDocument<T>(
  collectionName: string,
  id: string,
  data: Partial<T>,
): Promise<void> {
  const docRef = adminDb.collection(collectionName).doc(id);
  await docRef.update({
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteDocument(
  collectionName: string,
  id: string,
): Promise<void> {
  const docRef = adminDb.collection(collectionName).doc(id);
  await docRef.delete();
}

export async function queryDocuments<T>(
  collectionName: string,
  filters: Record<string, any> = {},
  orderByField?: string,
  limitCount?: number,
): Promise<T[]> {
  let queryRef = adminDb.collection(collectionName);

  // Apply filters
  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      queryRef = queryRef.where(field, "==", value) as any;
    }
  });

  // Apply ordering
  if (orderByField) {
    queryRef = queryRef.orderBy(orderByField, "desc") as any;
  }

  // Apply limit
  if (limitCount) {
    queryRef = queryRef.limit(limitCount) as any;
  }

  const snapshot = await queryRef.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}
```

## 📋 Phase 3: API Implementation Pattern

### Example: Events API

**`app/api/events/route.ts`** (GET all events, POST create event)

```typescript
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";

// GET /api/events - List all published events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const filters: Record<string, any> = { status };
    if (category) filters.category = category;
    if (featured) filters.featured = featured === "true";

    const events = await queryDocuments<Event>(
      "events",
      filters,
      "startDate",
      50,
    );

    return successResponse(events);
  } catch (error: any) {
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch events",
      error.message,
    );
  }
}

// POST /api/events - Create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate with Zod schema (implement in schemas)
    // const validated = eventSchema.parse(body);

    const eventId = await createDocument("events", {
      ...body,
      createdBy: session.userId,
      registrationCount: 0,
      invitationCount: 0,
    });

    return successResponse({ id: eventId }, "Event created successfully");
  } catch (error: any) {
    return errorResponse(
      "CREATE_ERROR",
      "Failed to create event",
      error.message,
    );
  }
}
```

**`app/api/events/[eventId]/route.ts`** (GET, PATCH, DELETE single event)

```typescript
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";

// GET /api/events/[eventId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const event = await getDocument<Event>("events", eventId);

    if (!event) {
      return notFoundResponse("Event not found");
    }

    return successResponse(event);
  } catch (error: any) {
    return errorResponse("FETCH_ERROR", "Failed to fetch event", error.message);
  }
}

// PATCH /api/events/[eventId] - Update event (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse();
    }

    const { eventId } = await params;
    const body = await request.json();

    await updateDocument("events", eventId, body);

    return successResponse({ id: eventId }, "Event updated successfully");
  } catch (error: any) {
    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update event",
      error.message,
    );
  }
}

// DELETE /api/events/[eventId] - Delete event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return unauthorizedResponse();
    }

    const { eventId } = await params;
    await deleteDocument("events", eventId);

    return successResponse(null, "Event deleted successfully");
  } catch (error: any) {
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete event",
      error.message,
    );
  }
}
```

## 🎨 Phase 4: UI Components Pattern

### Example: Button Component

**`src/components/ui/Button.tsx`**

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold transition-all',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-40 disabled:cursor-not-allowed',

          // Variants
          variant === 'primary' && 'bg-[#6B46C1] text-white hover:bg-[#553C9A] focus:ring-[#6B46C1] shadow-lg shadow-[#6B46C1]/25',
          variant === 'secondary' && 'bg-[#D4AF37] text-[#1F2937] hover:bg-[#B8941E] focus:ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/30',
          variant === 'outline' && 'border-2 border-[#6B46C1] text-[#6B46C1] hover:bg-[#9F7AEA]/20 focus:ring-[#6B46C1]',
          variant === 'ghost' && 'text-[#6B46C1] hover:bg-[#9F7AEA]/20',

          // Sizes
          size === 'sm' && 'px-6 py-3 text-sm rounded-lg',
          size === 'md' && 'px-8 py-3.5 text-base rounded-lg',
          size === 'lg' && 'px-10 py-4 text-lg rounded-xl',
          size === 'xl' && 'px-12 py-5 text-xl rounded-2xl',

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

## 📄 Phase 5: Page Implementation Pattern

### Example: Events Portal Page

**`app/(public)/events/page.tsx`**

```typescript
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { EventCard } from '@/src/components/public/events/EventCard';

export default async function EventsPage() {
  // Fetch events server-side
  const events = await queryDocuments<Event>('events', { status: 'published' }, 'startDate');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F3EFFF] to-[#F8FAFC] py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl font-bold text-[#1F2937] mb-4">Events</h1>
          <p className="text-xl text-[#475569]">Join us for transformative gatherings</p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

## 🚀 Implementation Checklist

### Week 1: Core Infrastructure

- [ ] Set up Firebase project
- [ ] Configure environment variables
- [ ] Implement authentication system
- [ ] Create API utilities
- [ ] Set up Firestore utilities

### Week 2: API Layer

- [ ] Events API (all endpoints)
- [ ] Registrations API
- [ ] Invitations API
- [ ] Auth API

### Week 3: UI Components

- [ ] Base UI components (Button, Input, Card, etc.)
- [ ] Layout components (Header, Footer)
- [ ] Event components

### Week 4: Public Pages

- [ ] Homepage
- [ ] Events portal
- [ ] Event microsite
- [ ] Registration flow

### Week 5: Admin System

- [ ] Admin login
- [ ] Dashboard
- [ ] Event management
- [ ] Analytics

## 📚 Resources

### File Templates Available:

1. API route template (shown above)
2. UI component template (shown above)
3. Page template (shown above)
4. Firestore utility template (shown above)

### Patterns to Replicate:

- Use the Events API pattern for all other entities (Sermons, Blog, Ministries)
- Use the Button component pattern for all UI components
- Use the Events page pattern for all public pages

## 🎯 Next Actions

1. **Install dependencies**: `npm install`
2. **Set up Firebase**: Create project, get credentials
3. **Configure environment**: Copy `.env.example` to `.env.local`
4. **Implement auth system**: Create session.ts and middleware
5. **Build first API**: Events API following the pattern
6. **Create first page**: Events portal
7. **Iterate**: Replicate patterns for other features

This foundation provides everything needed to build the complete platform systematically.
