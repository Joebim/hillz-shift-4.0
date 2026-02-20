# Project Overview & Structure

## Project Description

**Hillz Shift 4.0** is a web application built for managing registrations and invitations for the "SHIFT 4.0" Christian conference ("A Date with Jesus"). The event is scheduled for January 31st, 2026, at Radisson Ikeja, Lagos.

The application serves two main purposes:

1.  **Public Facing**: Allows users to view event details, register themselves, invite others, and access related media (Spotify, YouTube).
2.  **Admin Management**: Provides a protected dashboard for administrators to view analytics, manage registrations, handle invitations, and oversee the event's attendee list.

## Implemented Features

### Public Features

- **Landing Page**: A rich, responsive landing page showcasing event details, venue, date, and "Shift Encounters" (Spotify integration).
- **Registration System**: Users can register for the event.
  - Form validation and submission.
  - Success confirmation page.
- **Invitation System**:
  - Users can invite others via email.
  - Invitation acceptance flow (`/invite`).
  - QR Code functionality (`/qr`) for easy access and sharing.
- **Media Integration**: Links to Spotify for the "Shift Encounters" series and a YouTube channel for video content.
- **Live Streaming**: Information about Google Meet live streaming for remote attendees.

### Admin Features

- **Authentication**: Secure admin login flow (`/admin/login`).
- **Dashboard**: Overview of key metrics, including total registrations and recent activity (`/admin`).
- **Analytics**: Detailed analytics page (`/admin/analytics`) to track event performance.
- **Registration Management**:
  - View and manage the list of registered participants (`/admin/registrations`).
- **Invitation Management**:
  - View and track sent invitations (`/admin/invitations`).
- **Security**: Uses admin cookies and sessions for protecting routes.

### Backend & Infrastructure

- **Next.js App Router**: Utilizes the modern App Router structure for routing and layouts.
- **API Routes**: Serverless functions handling business logic for auth, registration, invitations, and analytics.
- **Firebase**: Used as the primary database (Firestore) and for authentication.
- **Email Service**: Integrated with Nodemailer for sending transactional emails (e.g., invitations).
- **State Management**: Zustand stores for handling global state (registrations, invitations) on the client side.

## Folder Structure

```
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── app                 # Next.js App Router directory
│   ├── (site)          # Public-facing route group
│   │   ├── invite      # Invitation page
│   │   ├── qr          # QR code page
│   │   ├── register    # Registration page
│   │   ├── success     # Success confirmation page
│   │   └── page.tsx    # Landing/Home page
│   ├── admin           # Admin panel
│   │   ├── (protected) # Protected admin routes (Dashboard, Analytics, etc.)
│   │   │   ├── analytics
│   │   │   ├── invitations
│   │   │   ├── registrations
│   │   │   ├── AdminShell.tsx
│   │   │   └── page.tsx
│   │   └── login       # Admin login page
│   ├── api             # Backend API routes
│   │   ├── analytics
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── email
│   │   ├── invitations
│   │   ├── participants
│   │   └── registrations
│   ├── globals.css     # Global styles (including Tailwind)
│   ├── layout.tsx      # Root layout
│   └── favicon.ico
├── public              # Static assets (images, icons)
├── scripts             # Utility scripts
├── src                 # Source code
│   ├── components      # React components
│   │   ├── admin       # Admin-specific components
│   │   ├── invite      # Invitation-related components
│   │   ├── register    # Registration-related components
│   │   ├── shared      # Shared components (Banner, Header, Footer)
│   │   └── ui          # Reusable UI components (Button, Input, etc.)
│   ├── constants       # Constant values (routes, links)
│   ├── contexts        # React contexts
│   ├── hooks           # Custom React hooks
│   ├── lib             # Library code / Utilities
│   │   ├── adminCookie.ts
│   │   ├── adminSession.ts
│   │   ├── email.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── firebaseClient.ts
│   │   └── utils.ts
│   ├── middleware      # (Placeholder/Empty)
│   ├── providers       # React providers
│   ├── store           # Zustand state stores
│   │   ├── useInvitationStore.ts
│   │   └── useRegistrationStore.ts
│   ├── templates       # Email templates
│   ├── types           # TypeScript type definitions
│   └── utils           # Helper functions
├── middleware.ts       # Next.js middleware
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion, clsx/tailwind-merge
- **State Management**: Zustand, React Query (TanStack Query)
- **Backend/Database**: Firebase (Admin & Client SDKs)
- **Email**: Nodemailer
- **Icons**: Lucide React
