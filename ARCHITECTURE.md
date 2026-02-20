# Platform Architecture - Ministry Digital Ecosystem

## 1. Executive Overview

This document outlines the complete technical architecture for transforming a single-event registration site into a comprehensive ministry platform. The platform consists of:

1. **Public Church Website** - A permanent ministry presence with content pages, media, and engagement features
2. **Dynamic Event System** - Multi-event management where each event functions as its own microsite
3. **Admin Management Portal** - Comprehensive CMS for content, events, registrations, and analytics

The architecture is built on **Next.js 16 App Router**, **Firebase** (Firestore + Authentication + Storage), and follows modern web development best practices for scalability, performance, and maintainability.

---

## 2. Technology Stack

### 2.1 Core Framework

- **Next.js 16.1+** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety and developer experience

### 2.2 Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **clsx / tailwind-merge** - Conditional class management
- **Lucide React** - Icon system

### 2.3 Backend & Database

- **Firebase Firestore** - NoSQL database for all data
- **Firebase Authentication** - User and admin authentication
- **Firebase Storage** - Media file storage (images, videos, PDFs)
- **Firebase Admin SDK** - Server-side Firebase operations

### 2.4 State Management

- **Zustand** - Lightweight state management for client-side state
- **TanStack Query (React Query)** - Server state management, caching, and data fetching
- **React Context** - For theme/event-specific context

### 2.5 Email & Communication

- **Nodemailer** - Transactional email service
- **React Email** (recommended addition) - Email template system
- **SendGrid/Mailgun** (recommended) - Email delivery service

### 2.6 Additional Libraries

- **date-fns** or **day.js** - Date manipulation
- **react-hook-form** - Form management
- **zod** - Schema validation
- **recharts** - Data visualization for admin analytics
- **react-qr-code** - QR code generation
- **sharp** - Image optimization (server-side)

---

## 3. Project Folder Structure

```
hillz-shift-platform/
├── .env.local                          # Environment variables
├── .env.production                     # Production environment variables
├── .gitignore
├── next.config.ts                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json
├── middleware.ts                       # Next.js middleware for auth/routing
│
├── public/                             # Static assets
│   ├── images/
│   │   ├── ministry/                   # Ministry branding assets
│   │   ├── events/                     # Event-specific images (fallbacks)
│   │   └── placeholders/               # Placeholder images
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── manifest-icons/
│   ├── fonts/                          # Custom fonts if not using Google Fonts
│   └── documents/                      # Static PDFs, guides
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout (global providers, fonts)
│   ├── globals.css                     # Global styles, Tailwind imports
│   ├── not-found.tsx                   # 404 page
│   ├── error.tsx                       # Error boundary
│   │
│   ├── (public)/                       # Public route group
│   │   ├── layout.tsx                  # Public layout (header, footer)
│   │   │
│   │   ├── page.tsx                    # Homepage (/)
│   │   │
│   │   ├── about/
│   │   │   ├── page.tsx                # About the ministry
│   │   │   ├── vision/
│   │   │   │   └── page.tsx            # Vision & beliefs
│   │   │   ├── leadership/
│   │   │   │   └── page.tsx            # Pastors & leadership
│   │   │   └── history/
│   │   │       └── page.tsx            # Ministry history
│   │   │
│   │   ├── ministries/
│   │   │   ├── page.tsx                # Ministries overview
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Individual ministry page
│   │   │
│   │   ├── sermons/
│   │   │   ├── page.tsx                # Sermons listing
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Individual sermon page
│   │   │
│   │   ├── events/
│   │   │   ├── page.tsx                # Events portal (listing)
│   │   │   └── [eventId]/
│   │   │       ├── page.tsx            # Event microsite
│   │   │       ├── register/
│   │   │       │   └── page.tsx        # Event registration page
│   │   │       ├── success/
│   │   │       │   └── page.tsx        # Registration success
│   │   │       └── invite/
│   │   │           └── page.tsx        # Send invitations
│   │   │
│   │   ├── media/
│   │   │   ├── page.tsx                # Media hub
│   │   │   ├── videos/
│   │   │   │   └── page.tsx            # Video gallery
│   │   │   ├── podcasts/
│   │   │   │   └── page.tsx            # Podcast listing
│   │   │   └── gallery/
│   │   │       └── page.tsx            # Photo gallery
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx                # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Individual blog post
│   │   │
│   │   ├── give/
│   │   │   └── page.tsx                # Giving/donation page
│   │   │
│   │   ├── prayer/
│   │   │   └── page.tsx                # Prayer request form
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx                # Contact page
│   │   │
│   │   └── live/
│   │       └── page.tsx                # Live streaming page
│   │
│   ├── admin/                          # Admin route group
│   │   ├── layout.tsx                  # Admin layout (sidebar, auth check)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                # Admin login
│   │   │
│   │   ├── (protected)/                # Protected admin routes
│   │   │   ├── layout.tsx              # Protected layout with auth guard
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Admin dashboard overview
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── page.tsx            # All events list
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx        # Create new event
│   │   │   │   ├── [eventId]/
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx    # Edit event
│   │   │   │   │   ├── registrations/
│   │   │   │   │   │   └── page.tsx    # Event registrations
│   │   │   │   │   ├── invitations/
│   │   │   │   │   │   └── page.tsx    # Event invitations
│   │   │   │   │   └── analytics/
│   │   │   │   │       └── page.tsx    # Event analytics
│   │   │   │   └── archived/
│   │   │   │       └── page.tsx        # Archived events
│   │   │   │
│   │   │   ├── registrations/
│   │   │   │   └── page.tsx            # All registrations across events
│   │   │   │
│   │   │   ├── invitations/
│   │   │   │   └── page.tsx            # All invitations across events
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx            # Global analytics dashboard
│   │   │   │
│   │   │   ├── content/                # CMS section
│   │   │   │   ├── pages/
│   │   │   │   │   ├── page.tsx        # Manage site pages
│   │   │   │   │   └── [pageId]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx # Edit page content
│   │   │   │   ├── sermons/
│   │   │   │   │   ├── page.tsx        # Manage sermons
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx    # Create sermon
│   │   │   │   │   └── [sermonId]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx # Edit sermon
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx        # Manage blog posts
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx    # Create post
│   │   │   │   │   └── [postId]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx # Edit post
│   │   │   │   ├── media/
│   │   │   │   │   └── page.tsx        # Media library
│   │   │   │   └── ministries/
│   │   │   │       ├── page.tsx        # Manage ministries
│   │   │   │       └── [ministryId]/
│   │   │   │           └── edit/
│   │   │   │               └── page.tsx # Edit ministry
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx            # General settings
│   │   │       ├── branding/
│   │   │       │   └── page.tsx        # Ministry branding
│   │   │       ├── users/
│   │   │       │   └── page.tsx        # Admin user management
│   │   │       └── integrations/
│   │   │           └── page.tsx        # Third-party integrations
│   │
│   └── api/                            # API routes
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts            # Admin login
│       │   ├── logout/
│       │   │   └── route.ts            # Admin logout
│       │   └── session/
│       │       └── route.ts            # Session validation
│       │
│       ├── events/
│       │   ├── route.ts                # GET all events, POST create event
│       │   ├── [eventId]/
│       │   │   ├── route.ts            # GET, PATCH, DELETE event
│       │   │   ├── register/
│       │   │   │   └── route.ts        # POST registration
│       │   │   ├── registrations/
│       │   │   │   └── route.ts        # GET registrations for event
│       │   │   ├── invitations/
│       │   │   │   └── route.ts        # POST send invitation
│       │   │   └── analytics/
│       │   │       └── route.ts        # GET event analytics
│       │   └── featured/
│       │       └── route.ts            # GET featured events
│       │
│       ├── registrations/
│       │   ├── route.ts                # GET all registrations
│       │   └── [registrationId]/
│       │       └── route.ts            # GET, PATCH, DELETE registration
│       │
│       ├── invitations/
│       │   ├── route.ts                # GET all invitations
│       │   ├── [invitationId]/
│       │   │   └── route.ts            # GET, PATCH invitation
│       │   └── accept/
│       │       └── route.ts            # POST accept invitation
│       │
│       ├── sermons/
│       │   ├── route.ts                # GET all sermons, POST create
│       │   └── [sermonId]/
│       │       └── route.ts            # GET, PATCH, DELETE sermon
│       │
│       ├── blog/
│       │   ├── route.ts                # GET all posts, POST create
│       │   └── [postId]/
│       │       └── route.ts            # GET, PATCH, DELETE post
│       │
│       ├── ministries/
│       │   ├── route.ts                # GET all ministries, POST create
│       │   └── [ministryId]/
│       │       └── route.ts            # GET, PATCH, DELETE ministry
│       │
│       ├── media/
│       │   ├── upload/
│       │   │   └── route.ts            # POST upload media to Firebase Storage
│       │   └── [mediaId]/
│       │       └── route.ts            # GET, DELETE media
│       │
│       ├── analytics/
│       │   ├── dashboard/
│       │   │   └── route.ts            # GET dashboard stats
│       │   └── events/
│       │       └── route.ts            # GET event-specific analytics
│       │
│       ├── prayer/
│       │   └── route.ts                # POST prayer request
│       │
│       └── contact/
│           └── route.ts                # POST contact form
│
├── src/
│   ├── components/                     # React components
│   │   ├── public/                     # Public-facing components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx          # Main navigation header
│   │   │   │   ├── Footer.tsx          # Site footer
│   │   │   │   ├── MobileNav.tsx       # Mobile navigation
│   │   │   │   └── Breadcrumb.tsx      # Breadcrumb navigation
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx            # Homepage hero
│   │   │   │   ├── MinistryIntro.tsx   # Ministry introduction
│   │   │   │   ├── VisionHighlights.tsx # Vision section
│   │   │   │   ├── EventSpotlight.tsx  # Featured event
│   │   │   │   ├── SermonPreview.tsx   # Latest sermons
│   │   │   │   ├── CTABlock.tsx        # Call-to-action
│   │   │   │   ├── Testimonials.tsx    # Testimonials carousel
│   │   │   │   └── Newsletter.tsx      # Newsletter signup
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── EventCard.tsx       # Event card component
│   │   │   │   ├── EventGrid.tsx       # Event grid layout
│   │   │   │   ├── EventFilters.tsx    # Filter bar
│   │   │   │   ├── EventHero.tsx       # Event microsite hero
│   │   │   │   ├── EventDetails.tsx    # Event details strip
│   │   │   │   ├── SpeakerCard.tsx     # Speaker card
│   │   │   │   ├── EventSchedule.tsx   # Schedule timeline
│   │   │   │   ├── RegistrationForm.tsx # Registration form
│   │   │   │   ├── InvitationForm.tsx  # Invitation form
│   │   │   │   ├── EventFAQ.tsx        # FAQ accordion
│   │   │   │   └── CountdownTimer.tsx  # Countdown component
│   │   │   │
│   │   │   ├── sermons/
│   │   │   │   ├── SermonCard.tsx      # Sermon card
│   │   │   │   ├── SermonGrid.tsx      # Sermon grid
│   │   │   │   └── SermonPlayer.tsx    # Audio/video player
│   │   │   │
│   │   │   ├── media/
│   │   │   │   ├── VideoCard.tsx       # Video card
│   │   │   │   ├── PhotoGallery.tsx    # Photo gallery
│   │   │   │   └── MediaPlayer.tsx     # Media player
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── PageHero.tsx        # Generic page hero
│   │   │       ├── SectionHeading.tsx  # Section heading
│   │   │       ├── TestimonyCard.tsx   # Testimony card
│   │   │       └── SocialShare.tsx     # Social sharing buttons
│   │   │
│   │   ├── admin/                      # Admin-specific components
│   │   │   ├── layout/
│   │   │   │   ├── AdminSidebar.tsx    # Admin sidebar navigation
│   │   │   │   ├── AdminTopBar.tsx     # Admin top bar
│   │   │   │   └── AdminMobileNav.tsx  # Admin mobile nav
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.tsx        # Dashboard stat card
│   │   │   │   ├── RecentActivity.tsx  # Recent activity widget
│   │   │   │   ├── UpcomingEvents.tsx  # Upcoming events widget
│   │   │   │   └── QuickActions.tsx    # Quick action buttons
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── EventForm.tsx       # Event creation/edit form
│   │   │   │   ├── EventList.tsx       # Admin event list
│   │   │   │   ├── EventStatusBadge.tsx # Event status indicator
│   │   │   │   └── EventThemePicker.tsx # Event theme customizer
│   │   │   │
│   │   │   ├── registrations/
│   │   │   │   ├── RegistrationTable.tsx # Registration data table
│   │   │   │   ├── RegistrationFilters.tsx # Filter controls
│   │   │   │   └── RegistrationDetails.tsx # Registration detail modal
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── RegistrationChart.tsx # Registration chart
│   │   │   │   ├── EventMetrics.tsx    # Event metrics display
│   │   │   │   └── AnalyticsSummary.tsx # Analytics summary
│   │   │   │
│   │   │   └── content/
│   │   │       ├── RichTextEditor.tsx  # Rich text editor
│   │   │       ├── MediaUploader.tsx   # Media upload component
│   │   │       ├── PageBuilder.tsx     # Page builder interface
│   │   │       └── ContentPreview.tsx  # Content preview
│   │   │
│   │   └── ui/                         # Reusable UI components
│   │       ├── Button.tsx              # Button component
│   │       ├── Input.tsx               # Input component
│   │       ├── Select.tsx              # Select dropdown
│   │       ├── Textarea.tsx            # Textarea component
│   │       ├── Checkbox.tsx            # Checkbox component
│   │       ├── Radio.tsx               # Radio button
│   │       ├── Toggle.tsx              # Toggle switch
│   │       ├── Modal.tsx               # Modal component
│   │       ├── Card.tsx                # Card component
│   │       ├── Badge.tsx               # Badge component
│   │       ├── Alert.tsx               # Alert component
│   │       ├── Toast.tsx               # Toast notification
│   │       ├── Tabs.tsx                # Tabs component
│   │       ├── Accordion.tsx           # Accordion component
│   │       ├── Dropdown.tsx            # Dropdown menu
│   │       ├── Table.tsx               # Table component
│   │       ├── Pagination.tsx          # Pagination component
│   │       ├── Spinner.tsx             # Loading spinner
│   │       ├── Skeleton.tsx            # Skeleton loader
│   │       └── DatePicker.tsx          # Date picker
│   │
│   ├── lib/                            # Core library code
│   │   ├── firebase/
│   │   │   ├── admin.ts                # Firebase Admin SDK initialization
│   │   │   ├── client.ts               # Firebase Client SDK initialization
│   │   │   ├── auth.ts                 # Authentication utilities
│   │   │   ├── firestore.ts            # Firestore utilities
│   │   │   └── storage.ts              # Storage utilities
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts              # Session management
│   │   │   ├── cookies.ts              # Cookie utilities
│   │   │   └── middleware.ts           # Auth middleware helpers
│   │   │
│   │   ├── email/
│   │   │   ├── client.ts               # Email client setup
│   │   │   ├── templates.ts            # Email template renderer
│   │   │   └── sender.ts               # Email sending utilities
│   │   │
│   │   └── utils.ts                    # General utilities (cn, formatters, etc.)
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAuth.ts                  # Authentication hook
│   │   ├── useEvents.ts                # Events data hook
│   │   ├── useRegistrations.ts         # Registrations data hook
│   │   ├── useInvitations.ts           # Invitations data hook
│   │   ├── useSermons.ts               # Sermons data hook
│   │   ├── useMediaQuery.ts            # Responsive hook
│   │   ├── useDebounce.ts              # Debounce hook
│   │   └── useToast.ts                 # Toast notification hook
│   │
│   ├── store/                          # Zustand stores
│   │   ├── authStore.ts                # Auth state
│   │   ├── eventStore.ts               # Event state
│   │   ├── themeStore.ts               # Theme/event branding state
│   │   └── uiStore.ts                  # UI state (modals, sidebars, etc.)
│   │
│   ├── contexts/                       # React contexts
│   │   ├── EventThemeContext.tsx       # Event-specific theme context
│   │   └── ToastContext.tsx            # Toast notification context
│   │
│   ├── providers/                      # React providers
│   │   ├── QueryProvider.tsx           # TanStack Query provider
│   │   ├── AuthProvider.tsx            # Auth provider
│   │   └── ThemeProvider.tsx           # Theme provider
│   │
│   ├── types/                          # TypeScript type definitions
│   │   ├── event.ts                    # Event types
│   │   ├── registration.ts             # Registration types
│   │   ├── invitation.ts               # Invitation types
│   │   ├── sermon.ts                   # Sermon types
│   │   ├── blog.ts                     # Blog types
│   │   ├── ministry.ts                 # Ministry types
│   │   ├── user.ts                     # User types
│   │   ├── media.ts                    # Media types
│   │   └── api.ts                      # API response types
│   │
│   ├── schemas/                        # Zod validation schemas
│   │   ├── event.schema.ts             # Event validation
│   │   ├── registration.schema.ts      # Registration validation
│   │   ├── invitation.schema.ts        # Invitation validation
│   │   └── auth.schema.ts              # Auth validation
│   │
│   ├── constants/                      # Constants
│   │   ├── routes.ts                   # Route constants
│   │   ├── links.ts                    # External links
│   │   ├── config.ts                   # App configuration
│   │   └── eventStatus.ts              # Event status constants
│   │
│   ├── utils/                          # Utility functions
│   │   ├── formatters.ts               # Date, currency, text formatters
│   │   ├── validators.ts               # Validation helpers
│   │   ├── imageOptimizer.ts           # Image optimization
│   │   └── analytics.ts                # Analytics calculation helpers
│   │
│   └── templates/                      # Email templates
│       ├── registration-confirmation.tsx # Registration email
│       ├── invitation.tsx              # Invitation email
│       ├── event-reminder.tsx          # Event reminder email
│       └── newsletter.tsx              # Newsletter template
│
├── scripts/                            # Utility scripts
│   ├── seed-database.ts                # Database seeding script
│   ├── migrate-events.ts               # Data migration script
│   └── generate-sitemap.ts             # Sitemap generation
│
└── docs/                               # Documentation
    ├── DESIGN_SYSTEM.md                # Design system guide
    ├── ARCHITECTURE.md                 # This file
    ├── API.md                          # API documentation
    └── DEPLOYMENT.md                   # Deployment guide
```

---

## 4. Data Model

### 4.1 Collections Structure (Firestore)

#### **events** Collection

```typescript
{
  id: string;                           // Auto-generated document ID
  title: string;                        // Event title
  slug: string;                         // URL-friendly slug
  description: string;                  // Full description (rich text/HTML)
  shortDescription: string;             // Brief summary for cards

  // Dates & Status
  status: 'draft' | 'published' | 'upcoming' | 'ongoing' | 'completed' | 'archived';
  startDate: Timestamp;                 // Event start date/time
  endDate: Timestamp;                   // Event end date/time
  registrationOpenDate: Timestamp;      // When registration opens
  registrationCloseDate: Timestamp;     // When registration closes

  // Location
  venue: {
    name: string;                       // Venue name
    address: string;                    // Full address
    city: string;
    country: string;
    coordinates?: {                     // For map integration
      lat: number;
      lng: number;
    };
  };

  // Branding & Media
  branding: {
    primaryColor: string;               // Hex color
    secondaryColor: string;             // Hex color
    accentColor: string;                // Hex color
    bannerImage: string;                // Firebase Storage URL
    logoImage?: string;                 // Firebase Storage URL
    backgroundPattern?: string;         // Pattern or gradient identifier
  };

  // Content
  category: string;                     // Conference, Workshop, Retreat, etc.
  tags: string[];                       // Searchable tags
  speakers: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    photo: string;                      // Firebase Storage URL
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  }>;

  schedule: Array<{
    id: string;
    time: string;                       // e.g., "10:00 AM"
    title: string;
    description: string;
    speaker?: string;                   // Speaker name
    location?: string;                  // Room/location if multi-track
  }>;

  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Registration
  registrationConfig: {
    enabled: boolean;
    capacity?: number;                  // Max attendees (null = unlimited)
    requiresApproval: boolean;          // Manual approval required
    fields: Array<{                     // Custom form fields
      id: string;
      label: string;
      type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox';
      required: boolean;
      options?: string[];               // For select fields
    }>;
    ticketTypes?: Array<{               // If paid event
      id: string;
      name: string;                     // General, VIP, Student, etc.
      price: number;
      currency: string;
      capacity?: number;
    }>;
  };

  // Media & Links
  mediaLinks: {
    livestreamUrl?: string;             // Google Meet, YouTube, etc.
    spotifyUrl?: string;
    youtubeUrl?: string;
    resourcesUrl?: string;              // Downloadable resources
  };

  // Sponsors (optional)
  sponsors?: Array<{
    name: string;
    logo: string;                       // Firebase Storage URL
    website?: string;
    tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  }>;

  // Metadata
  featured: boolean;                    // Show on homepage
  registrationCount: number;            // Cached count for performance
  invitationCount: number;              // Cached count
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;                    // Admin user ID
}
```

#### **registrations** Collection

```typescript
{
  id: string;
  eventId: string;                      // Reference to event

  // Attendee Info
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customFields: Record<string, any>;  // Dynamic fields from event config
  };

  // Registration Details
  status: 'confirmed' | 'pending' | 'cancelled' | 'waitlist';
  ticketType?: string;                  // If event has ticket types
  registrationDate: Timestamp;
  confirmationCode: string;             // Unique code for check-in

  // Payment (if applicable)
  payment?: {
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paymentDate?: Timestamp;
  };

  // Invitation tracking
  invitedBy?: string;                   // Invitation ID if came via invitation

  // Check-in (future feature)
  checkedIn: boolean;
  checkInTime?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **invitations** Collection

```typescript
{
  id: string;
  eventId: string;                      // Reference to event

  // Sender Info
  senderName: string;
  senderEmail: string;

  // Recipient Info
  recipientEmail: string;
  recipientName?: string;
  personalMessage?: string;             // Custom message from sender

  // Status
  status: 'sent' | 'opened' | 'accepted' | 'declined';
  sentDate: Timestamp;
  openedDate?: Timestamp;
  respondedDate?: Timestamp;

  // Tracking
  invitationCode: string;               // Unique code for tracking
  registrationId?: string;              // If accepted and registered

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **sermons** Collection

```typescript
{
  id: string;
  title: string;
  slug: string;
  description: string;

  // Content
  speaker: string;                      // Speaker name
  series?: string;                      // Sermon series name
  scripture: string;                    // Bible reference
  date: Timestamp;                      // Sermon date

  // Media
  mediaType: 'audio' | 'video' | 'both';
  audioUrl?: string;                    // Firebase Storage or external URL
  videoUrl?: string;                    // YouTube, Vimeo, or Firebase Storage
  thumbnailUrl: string;                 // Thumbnail image
  duration?: number;                    // Duration in seconds

  // Metadata
  tags: string[];
  category: string;                     // Sunday Service, Bible Study, etc.
  featured: boolean;
  viewCount: number;                    // Cached view count

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

#### **blog** Collection

```typescript
{
  id: string;
  title: string;
  slug: string;
  excerpt: string;                      // Short summary
  content: string;                      // Full content (rich text/HTML)

  // Author
  author: {
    id: string;
    name: string;
    photo?: string;
  };

  // Media
  featuredImage: string;                // Firebase Storage URL

  // Categorization
  category: string;
  tags: string[];

  // Publishing
  status: 'draft' | 'published' | 'archived';
  publishedDate?: Timestamp;

  // Metadata
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **ministries** Collection

```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;

  // Visual
  icon: string;                         // Icon identifier or image URL
  color: string;                        // Theme color for ministry
  image: string;                        // Featured image

  // Leadership
  leader?: {
    name: string;
    photo?: string;
    bio?: string;
  };

  // Details
  meetingSchedule?: string;             // e.g., "Every Sunday, 9 AM"
  location?: string;
  contactEmail?: string;

  // Content
  activities: string[];                 // List of activities

  // Metadata
  order: number;                        // Display order
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **pages** Collection (CMS)

```typescript
{
  id: string;
  title: string;
  slug: string;                         // URL path
  content: string;                      // Rich text/HTML content

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Publishing
  status: 'draft' | 'published';
  publishedDate?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

#### **media** Collection

```typescript
{
  id: string;
  fileName: string;
  fileType: string;                     // image/jpeg, video/mp4, etc.
  fileSize: number;                     // Bytes
  url: string;                          // Firebase Storage URL

  // Metadata
  uploadedBy: string;                   // Admin user ID
  uploadedAt: Timestamp;

  // Organization
  folder?: string;                      // events, sermons, blog, etc.
  tags: string[];

  // Image-specific
  dimensions?: {
    width: number;
    height: number;
  };
}
```

#### **users** Collection (Admin Users)

```typescript
{
  id: string;                           // Firebase Auth UID
  email: string;
  displayName: string;
  photoUrl?: string;

  // Role & Permissions
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  permissions: string[];                // Granular permissions array

  // Status
  active: boolean;
  lastLogin?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **settings** Collection (Global Settings)

```typescript
{
  id: 'global';                         // Single document

  // Ministry Info
  ministryName: string;
  tagline: string;
  description: string;
  logo: string;                         // Firebase Storage URL

  // Contact
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Social Media
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    spotify?: string;
  };

  // Branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Features
  features: {
    eventsEnabled: boolean;
    sermonsEnabled: boolean;
    blogEnabled: boolean;
    givingEnabled: boolean;
    prayerRequestsEnabled: boolean;
  };

  // Integrations
  integrations: {
    googleAnalyticsId?: string;
    mailchimpApiKey?: string;
    stripePublicKey?: string;
    // etc.
  };

  updatedAt: Timestamp;
  updatedBy: string;
}
```

### 4.2 Data Relationships

- **One-to-Many**: Event → Registrations, Event → Invitations
- **Referenced Data**: Store IDs and denormalize frequently accessed data (e.g., event title in registration)
- **Cached Counts**: Store registration/invitation counts on event document for performance
- **Indexes**: Create composite indexes for common queries (e.g., eventId + status, category + publishedDate)

---

## 5. API Layer Structure

### 5.1 API Design Principles

- **RESTful Routes**: Follow REST conventions for predictable API structure
- **Server Components**: Leverage Next.js Server Components for initial data fetching
- **Route Handlers**: Use Route Handlers (app/api) for mutations and client-side data fetching
- **Server Actions**: Consider Server Actions for form submissions and mutations
- **Authentication**: Verify admin session on all protected routes
- **Validation**: Use Zod schemas to validate all inputs
- **Error Handling**: Consistent error response format
- **Rate Limiting**: Implement rate limiting on public endpoints (registration, contact forms)

### 5.2 API Response Format

**Success Response**

```typescript
{
  success: true;
  data: T;                              // Response data
  message?: string;                     // Optional success message
}
```

**Error Response**

```typescript
{
  success: false;
  error: {
    code: string;                       // Error code (e.g., 'VALIDATION_ERROR')
    message: string;                    // User-friendly message
    details?: any;                      // Additional error details
  };
}
```

### 5.3 Key API Endpoints

#### Events API

- `GET /api/events` - List all published events (with filters)
- `GET /api/events/featured` - Get featured events
- `GET /api/events/[eventId]` - Get single event details
- `POST /api/events` - Create event (admin)
- `PATCH /api/events/[eventId]` - Update event (admin)
- `DELETE /api/events/[eventId]` - Delete event (admin)
- `GET /api/events/[eventId]/analytics` - Get event analytics (admin)

#### Registrations API

- `POST /api/events/[eventId]/register` - Register for event
- `GET /api/events/[eventId]/registrations` - List registrations (admin)
- `GET /api/registrations` - List all registrations (admin)
- `GET /api/registrations/[registrationId]` - Get registration details
- `PATCH /api/registrations/[registrationId]` - Update registration (admin)
- `DELETE /api/registrations/[registrationId]` - Cancel registration

#### Invitations API

- `POST /api/events/[eventId]/invitations` - Send invitation
- `GET /api/invitations` - List all invitations (admin)
- `GET /api/invitations/[invitationId]` - Get invitation details
- `POST /api/invitations/accept` - Accept invitation (creates registration)
- `PATCH /api/invitations/[invitationId]` - Update invitation status

#### Sermons API

- `GET /api/sermons` - List all published sermons (with pagination)
- `GET /api/sermons/[sermonId]` - Get single sermon
- `POST /api/sermons` - Create sermon (admin)
- `PATCH /api/sermons/[sermonId]` - Update sermon (admin)
- `DELETE /api/sermons/[sermonId]` - Delete sermon (admin)

#### Blog API

- `GET /api/blog` - List all published posts
- `GET /api/blog/[postId]` - Get single post
- `POST /api/blog` - Create post (admin)
- `PATCH /api/blog/[postId]` - Update post (admin)
- `DELETE /api/blog/[postId]` - Delete post (admin)

#### Media API

- `POST /api/media/upload` - Upload media file (admin)
- `GET /api/media` - List all media (admin)
- `DELETE /api/media/[mediaId]` - Delete media (admin)

#### Analytics API

- `GET /api/analytics/dashboard` - Dashboard overview stats (admin)
- `GET /api/analytics/events` - Event-specific analytics (admin)

#### Public Forms API

- `POST /api/prayer` - Submit prayer request
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Newsletter signup

---

## 6. Theming System

### 6.1 Global Theme

- Default ministry branding stored in `settings` collection
- Applied via CSS custom properties in root layout
- Tailwind config extends with custom colors

### 6.2 Event-Specific Themes

- Each event has `branding` object with custom colors
- Event microsite pages read event branding from database
- React Context provides theme to all child components
- CSS custom properties override global theme on event pages

### 6.3 Implementation Approach

**Root Layout** (`app/layout.tsx`)

```typescript
// Fetch global settings
// Set CSS variables for ministry colors
<body style={{
  '--color-primary': settings.primaryColor,
  '--color-secondary': settings.secondaryColor,
  // etc.
}}>
```

**Event Layout** (`app/(public)/events/[eventId]/layout.tsx`)

```typescript
// Fetch event branding
// Override CSS variables for event colors
<EventThemeProvider theme={event.branding}>
  {children}
</EventThemeProvider>
```

**CSS Custom Properties**

```css
:root {
  --color-primary: #6b46c1;
  --color-secondary: #d4af37;
  /* etc. */
}

.event-theme {
  --color-primary: var(--event-primary, #6b46c1);
  --color-secondary: var(--event-secondary, #d4af37);
  /* etc. */
}
```

**Tailwind Integration**

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      // etc.
    }
  }
}
```

---

## 7. Event Lifecycle Management

### 7.1 Event Status Flow

```
Draft → Published → Upcoming → Ongoing → Completed → Archived
```

**Draft**

- Event created but not visible to public
- Admin can edit all details
- No registrations accepted

**Published**

- Event visible on events portal
- Registrations may or may not be open (depends on registration dates)
- Fully editable by admin

**Upcoming**

- Automatically set when current date is before event start date
- Registrations open (if within registration window)
- Event appears in "Upcoming Events" sections

**Ongoing**

- Automatically set when current date is between start and end date
- Registrations may be closed
- Event appears in "Happening Now" sections
- Livestream links prominently displayed

**Completed**

- Automatically set when current date is after event end date
- Registrations closed
- Event appears in "Past Events" with "Completed" badge
- Media/resources still accessible

**Archived**

- Manually set by admin
- Event removed from main listings but still accessible via direct link
- Used for old events to declutter the events portal

### 7.2 Automated Status Updates

**Scheduled Job** (using Next.js API route + cron service like Vercel Cron or external)

- Runs daily at midnight
- Queries all events
- Updates status based on current date vs. event dates
- Sends notifications if needed (e.g., event starting tomorrow)

**Alternative**: Client-side status calculation

- Status computed dynamically based on dates when rendering
- No database updates needed
- Trade-off: Slightly more complex queries

---

## 8. Authentication & Authorization

### 8.1 Admin Authentication Flow

1. Admin navigates to `/admin/login`
2. Enters email and password
3. Firebase Authentication validates credentials
4. Server creates session cookie (httpOnly, secure)
5. Redirect to `/admin/dashboard`

### 8.2 Session Management

- **Session Cookie**: 7-day expiration, httpOnly, secure, sameSite=strict
- **Middleware**: Validates session on all `/admin/*` routes except `/admin/login`
- **Token Refresh**: Refresh Firebase token before expiration
- **Logout**: Clear session cookie and Firebase token

### 8.3 Role-Based Access Control (RBAC)

**Roles**

- **Super Admin**: Full access to all features
- **Admin**: Manage events, registrations, content (no settings access)
- **Editor**: Create/edit content (sermons, blog) but not publish
- **Viewer**: Read-only access to analytics and data

**Permission Checks**

- Check user role in middleware
- Conditional rendering in UI based on permissions
- API routes validate permissions before mutations

### 8.4 Public User Authentication (Future)

- Optional: Allow attendees to create accounts
- Benefits: View registration history, save favorite sermons, etc.
- Implementation: Firebase Authentication with email/password or social providers
- Separate from admin authentication

---

## 9. File Upload & Media Management

### 9.1 Firebase Storage Structure

```
/ministry-media/
  /events/
    /[eventId]/
      /banners/
        banner-1.jpg
      /logos/
        logo.png
      /speakers/
        speaker-1.jpg
  /sermons/
    /thumbnails/
      sermon-1.jpg
    /audio/
      sermon-1.mp3
  /blog/
    /featured-images/
      post-1.jpg
  /ministries/
    ministry-1.jpg
  /general/
    logo.png
    favicon.ico
```

### 9.2 Upload Flow

1. Admin selects file in upload component
2. Client-side validation (file type, size)
3. Upload to Firebase Storage via API route
4. Generate optimized versions (thumbnails, WebP) using Sharp
5. Store URLs in Firestore
6. Return URLs to client for preview

### 9.3 Image Optimization

- **Server-side**: Use Sharp to generate multiple sizes and formats
- **Client-side**: Use Next.js Image component for automatic optimization
- **Formats**: Store original + WebP + AVIF for modern browsers
- **Sizes**: Generate responsive sizes (thumbnail, medium, large, original)

### 9.4 Media Library

- Admin can browse all uploaded media
- Filter by type, date, folder
- Search by filename or tags
- Reuse media across different content
- Delete unused media

---

## 10. Email System

### 10.1 Email Types

**Transactional Emails**

- Registration confirmation
- Invitation to event
- Event reminder (1 day before)
- Password reset (admin)
- Contact form submission confirmation

**Marketing Emails** (Future)

- Newsletter
- Event announcements
- Sermon releases

### 10.2 Email Templates

- Use React Email or MJML for responsive templates
- Consistent branding with ministry colors
- Plain text fallback for all emails
- Unsubscribe link in marketing emails

### 10.3 Email Service Integration

**Recommended**: SendGrid or Mailgun

- Reliable delivery
- Analytics (open rates, click rates)
- Template management
- Bounce handling

**Implementation**

- Nodemailer with SMTP transport
- Queue system for bulk emails (optional: use Firestore as queue)
- Retry logic for failed sends

### 10.4 Email Tracking

- Track email opens (pixel tracking)
- Track link clicks (redirect through tracking URL)
- Store tracking data in Firestore
- Display in admin analytics

---

## 11. Search & Filtering

### 11.1 Client-Side Filtering

**Events Portal**

- Filter by status (upcoming, ongoing, completed)
- Filter by category
- Filter by date range
- Sort by date, alphabetical

**Implementation**: Filter in-memory after fetching all events (suitable for <1000 events)

### 11.2 Server-Side Search (Future Enhancement)

**Algolia Integration** (recommended for large scale)

- Index events, sermons, blog posts
- Instant search with typo tolerance
- Faceted filtering
- Autocomplete

**Firestore Queries**

- Limited full-text search capability
- Use composite indexes for common filter combinations
- Pagination with cursor-based approach

### 11.3 Search UI

- Global search bar in header
- Search across events, sermons, blog posts
- Display results grouped by type
- Highlight search terms in results

---

## 12. Analytics & Reporting

### 12.1 Admin Analytics Dashboard

**Key Metrics**

- Total events (all time, this year)
- Total registrations (all time, this month)
- Active events count
- Pending invitations
- Top performing events (by registrations)
- Registration trends (chart over time)
- Invitation acceptance rate
- Traffic sources (if integrated with Google Analytics)

### 12.2 Event-Specific Analytics

- Total registrations
- Registrations over time (chart)
- Registration sources (direct, invitation, social)
- Ticket type breakdown (if applicable)
- Invitations sent vs. accepted
- Geographic distribution (if collecting location data)

### 12.3 Data Visualization

- Use Recharts for charts
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Export data as CSV/Excel

### 12.4 Google Analytics Integration

- Track page views
- Track events (registration, invitation sent, etc.)
- Track conversions
- Custom dimensions for event tracking

---

## 13. Performance Optimization

### 13.1 Next.js Optimizations

- **Static Generation**: Pre-render public pages at build time where possible
- **Incremental Static Regeneration (ISR)**: Revalidate static pages periodically
- **Server Components**: Use for data fetching to reduce client bundle
- **Code Splitting**: Automatic with Next.js, lazy load heavy components
- **Image Optimization**: Use Next.js Image component
- **Font Optimization**: Use next/font for Google Fonts

### 13.2 Database Optimizations

- **Denormalization**: Store frequently accessed data redundantly (e.g., event title in registration)
- **Caching**: Cache event lists, sermon lists in React Query with stale-while-revalidate
- **Pagination**: Implement cursor-based pagination for large lists
- **Indexes**: Create composite indexes for common queries
- **Batch Reads**: Use Firestore batch reads to reduce round trips

### 13.3 Caching Strategy

**Client-Side**

- React Query: 5-minute stale time for event lists, 1-minute for dashboard stats
- Browser cache: Aggressive caching for static assets

**Server-Side**

- Next.js cache: Cache API responses with revalidation
- CDN: Use Vercel Edge Network or Cloudflare for global distribution

### 13.4 Bundle Size Optimization

- Tree-shaking: Remove unused code
- Dynamic imports: Lazy load admin components
- Analyze bundle: Use @next/bundle-analyzer
- Minimize dependencies: Avoid large libraries where possible

---

## 14. Security Considerations

### 14.1 Authentication Security

- **Password Requirements**: Minimum 8 characters, complexity rules
- **Session Security**: httpOnly cookies, secure flag, sameSite=strict
- **CSRF Protection**: Built-in with Next.js API routes
- **Rate Limiting**: Limit login attempts (5 per 15 minutes)

### 14.2 Data Security

- **Firestore Rules**: Strict rules to prevent unauthorized access
  - Public read for published events, sermons, blog
  - Write only for authenticated admins
  - User-specific data (registrations) readable only by admins
- **Input Validation**: Validate all inputs with Zod schemas
- **XSS Prevention**: Sanitize user-generated content (rich text)
- **SQL Injection**: N/A (using Firestore, not SQL)

### 14.3 API Security

- **Authentication**: Verify session on all admin endpoints
- **Authorization**: Check permissions before mutations
- **Rate Limiting**: Implement on public endpoints (registration, contact)
- **CORS**: Configure allowed origins
- **HTTPS**: Enforce HTTPS in production

### 14.4 File Upload Security

- **File Type Validation**: Whitelist allowed MIME types
- **File Size Limits**: Max 10MB for images, 50MB for videos
- **Virus Scanning**: Consider integration with ClamAV or similar (future)
- **Storage Rules**: Firebase Storage rules to prevent unauthorized uploads

---

## 15. Deployment & DevOps

### 15.1 Hosting

**Recommended**: Vercel

- Seamless Next.js integration
- Automatic deployments from Git
- Edge network for global performance
- Preview deployments for PRs
- Environment variable management

**Alternative**: Netlify, AWS Amplify, or self-hosted

### 15.2 Environment Variables

**Development** (`.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_PRIVATE_KEY=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASSWORD=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production** (`.env.production`)

- Same variables with production values
- Managed in Vercel dashboard

### 15.3 CI/CD Pipeline

1. Push to Git (GitHub, GitLab, Bitbucket)
2. Vercel detects changes
3. Run build process
4. Run tests (if configured)
5. Deploy to preview URL (for PRs) or production (for main branch)
6. Notify team via Slack/email

### 15.4 Monitoring & Logging

- **Error Tracking**: Sentry or similar for error monitoring
- **Performance Monitoring**: Vercel Analytics or Google Analytics
- **Logging**: Console logs in development, structured logging in production
- **Uptime Monitoring**: UptimeRobot or Pingdom

### 15.5 Backup & Disaster Recovery

- **Firestore Backups**: Automated daily backups (Firebase feature)
- **Storage Backups**: Replicate critical media to separate bucket
- **Code Backups**: Git repository (GitHub, GitLab)
- **Recovery Plan**: Document steps to restore from backup

---

## 16. Future Enhancements

### 16.1 Phase 2 Features

- **Mobile App**: React Native app for attendees
- **Check-In System**: QR code scanning for event check-in
- **Live Polling**: Real-time polls during events
- **Networking**: Attendee directory and messaging
- **Certificates**: Auto-generate attendance certificates

### 16.2 Phase 3 Features

- **Multi-Language Support**: i18n for global reach
- **Advanced Analytics**: AI-powered insights
- **CRM Integration**: Sync with Salesforce, HubSpot
- **Membership System**: Paid memberships with exclusive content
- **E-Commerce**: Sell event tickets, merchandise, books

### 16.3 Scalability Considerations

- **Database**: Firestore scales automatically, but consider sharding for 10M+ documents
- **Storage**: Firebase Storage scales, but consider CDN for video streaming
- **Compute**: Serverless functions scale, but monitor cold starts
- **Caching**: Implement Redis for high-traffic scenarios

---

## 17. Migration Plan

### 17.1 From Current Single-Event Site

**Step 1: Data Migration**

- Export existing registrations and invitations
- Create migration script to import into new Firestore structure
- Migrate "Hillz Shift 4.0" as first event in new system

**Step 2: Content Migration**

- Recreate homepage content in new CMS
- Set up ministry pages (About, Vision, etc.)
- Import any existing sermons or media

**Step 3: Parallel Deployment**

- Deploy new platform to staging environment
- Test all features thoroughly
- Train admin users on new system

**Step 4: Cutover**

- Update DNS to point to new platform
- Redirect old URLs to new structure (301 redirects)
- Monitor for issues in first 48 hours

**Step 5: Decommission**

- Keep old site as backup for 30 days
- Archive old codebase
- Celebrate successful migration!

### 17.2 Data Integrity Checks

- Verify all registrations migrated correctly
- Check invitation statuses preserved
- Ensure media files accessible
- Test email sending from new platform

---

## 18. Development Workflow

### 18.1 Git Branching Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/[name]**: Individual feature branches
- **hotfix/[name]**: Urgent production fixes

### 18.2 Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config + custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for linting and formatting

### 18.3 Testing Strategy

- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: Test API routes with mock Firestore
- **E2E Tests**: Playwright or Cypress for critical user flows
- **Manual Testing**: QA checklist for each release

### 18.4 Documentation

- **Code Comments**: JSDoc for complex functions
- **README**: Setup instructions, architecture overview
- **API Docs**: Document all API endpoints
- **User Guide**: Admin user manual for CMS

---

## 19. Conclusion

This architecture provides a solid foundation for a scalable, maintainable ministry platform. The design prioritizes:

- **User Experience**: Fast, intuitive, spiritually uplifting
- **Admin Experience**: Powerful yet simple content management
- **Scalability**: Handle growth from 10 to 10,000+ events
- **Performance**: Optimized for speed and SEO
- **Security**: Protect sensitive attendee data
- **Flexibility**: Easy to customize per event or ministry needs

The modular structure allows for incremental development, starting with core features (church website + basic event management) and expanding to advanced features (analytics, CRM integration, mobile app) over time.

---

**Next Steps**:

1. Review and approve this architecture document
2. Set up development environment
3. Initialize Next.js project with folder structure
4. Configure Firebase project
5. Begin implementation with design system components
6. Iterate based on feedback

This platform will serve as a powerful digital ecosystem for ministry growth and community engagement for years to come.
