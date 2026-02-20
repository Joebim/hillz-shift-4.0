# Design System - Ministry Platform

## 1. Visual Identity

### 1.1 Aesthetic Philosophy

**"Clean, Modern, Radiant, Approachable."**
The design system embraces a **Light Mode** base, focusing on **clarity, whitespace, and subtle elegance**. It uses soft drop shadows, clean borders, and a refined color palette to create an inviting and professional interface.

### 1.2 Color Palette

#### Primary Canvas (Light Mode Base)

- **Background** `#F8FAFC` - Soft off-white/slate-50 for main background.
- **Surface (Card)** `#FFFFFF` - Crisp white for cards and elevated surfaces.
- **Surface Hover** `#F1F5F9` - Light slate for hover states.
- **Border** `#E2E8F0` - Subtle slate-200 for borders.

#### Brand Colors & Accents

- **Primary** `#7C3AED` - Electric Violet (Main Action/Brand).
- **Primary Light** `#8B5CF6` - Violet-500.
- **Initial Gradient**: Linear Gradient `to right, #7C3AED, #EC4899` (Used sparingly for primary buttons/headers).

#### Functional Colors

- **Text Primary** `#1E293B` - Slate-800 (High contrast heading).
- **Text Secondary** `#64748B` - Slate-500 (Body text).
- **Text Muted** `#94A3B8` - Slate-400.
- **Success** `#10B981` - Emerald-500.
- **Warning** `#F59E0B` - Amber-500.
- **Error** `#EF4444` - Red-500.

### 1.3 Glassmorphism (Light)

- **Glass Base** `rgba(255, 255, 255, 0.7)` - Frosted white.
- **Glass Border** `rgba(255, 255, 255, 0.5)`
- **Glass Shadow** `0 4px 6px -1px rgba(0, 0, 0, 0.05)`

### 1.4 Typography & Radius

- **Headings**: `Outfit`
- **Body**: `Inter`
- **Radius**: `rounded-2xl` or `rounded-3xl` for cards, `rounded-xl` for inputs.

---

## 2. Component Design Language

### 2.1 Navigation Bars

#### Primary Navigation (Desktop)

**Structure**

- Fixed position at top, full width
- Height: 80px
- Background: Pure White with 95% opacity backdrop blur
- Border bottom: 1px Subtle border
- Shadow: Level 2 on scroll

**Layout**

- Logo: Left-aligned, 48px height, clickable to home
- Navigation Links: Center-aligned horizontal list
- CTA Button: Right-aligned (Register/Give)
- Spacing: 32px between major sections

**Navigation Links**

- Font: Inter 16px, Weight 600
- Color: Charcoal, hover to Royal Purple
- Underline: 3px Royal Purple bar slides in from left on hover (200ms)
- Active state: Royal Purple text with underline
- Spacing: 32px between links

**Dropdown Menus** (for Ministries, Events, etc.)

- Triggered on hover with 150ms delay
- Background: Pure White
- Shadow: Level 3
- Border radius: lg (16px)
- Padding: 16px
- Max width: 280px
- Links: 14px Inter, 12px vertical padding
- Hover: Light Purple background

#### Mobile Navigation

**Hamburger Menu**

- Icon: 24px, positioned top-right with 16px margin
- Color: Charcoal
- Animated to X on open (300ms)

**Mobile Menu Panel**

- Full-screen overlay
- Background: Pure White
- Slide in from right (300ms ease-out)
- Logo at top
- Links: 20px Inter Bold, 20px vertical padding
- Dividers: 1px Subtle border between sections
- CTA button: Full width at bottom

#### Sticky Behavior

- Shrinks to 64px height on scroll
- Logo scales to 36px
- Adds shadow Level 2
- Smooth transition 300ms

### 2.2 Hero Sections

#### Homepage Hero

**Structure**

- Full viewport height (min 600px, max 900px)
- Background: Divine Glory gradient with overlay image (40% opacity)
- Text: Center-aligned, white

**Content Layout**

- Eyebrow text: Label M, Gold color, uppercase
- Headline: Display XL, Playfair Display, white, max-width 900px
- Subheadline: Body XL, Inter, white with 90% opacity, max-width 700px
- CTA Group: Two buttons, 16px gap, centered
- Spacing: 16px eyebrow-to-headline, 24px headline-to-subheadline, 40px to CTAs

**Decorative Elements**

- Subtle animated gradient overlay (slow pulse, 8s duration)
- Floating particles or light rays (optional, CSS animation)
- Scroll indicator: Animated chevron at bottom, white with 70% opacity

#### Event Hero

**Structure**

- Height: 500px desktop, 400px mobile
- Background: Event-specific gradient or image
- Overlay: Dark Veil gradient for text readability

**Content**

- Event badge: Top-left, Label M, colored background (status-based)
- Event title: Display L, Playfair Display, white
- Date/Time/Venue: Body L, Inter, white with icon prefixes
- CTA: Primary button, positioned bottom-right or centered below text

#### Section Heroes (About, Ministries, etc.)

**Structure**

- Height: 400px desktop, 300px mobile
- Background: Soft Purple Wash or Ethereal Blue gradient
- Text: Left-aligned or centered

**Content**

- Page title: Display M, Playfair Display, Charcoal
- Breadcrumb: Body S, Silver, above title
- Description: Body L, Slate, max-width 600px

### 2.3 Cards

#### Event Card

**Structure**

- Width: Flexible (grid-based)
- Aspect ratio: 4:3 for image
- Background: Pure White
- Border: 2px Subtle border
- Border radius: xl (24px)
- Shadow: Level 1, hover to Level 3 (300ms)
- Hover: Lift 4px upward (transform translateY)

**Content Layout**

- Image: Top, full-width, border-radius-top xl
- Status Badge: Absolute top-right on image, 12px margin
- Content padding: 24px
- Event title: H4, Charcoal, 2-line clamp
- Date/Time: Body S, Slate, with Calendar icon
- Location: Body S, Slate, with MapPin icon
- Description: Body S, Slate, 3-line clamp
- CTA: Text link "Learn More" with arrow, Royal Purple

**Status Badge**

- Upcoming: Heavenly Blue background, white text
- Ongoing: Warning Amber background, white text
- Completed: Success Green background, white text
- Archived: Silver background, white text
- Font: Label S, Montserrat
- Padding: 6px 12px
- Border radius: full

#### Media Card (Sermon/Video)

**Structure**

- Similar to Event Card
- Aspect ratio: 16:9 for video thumbnail
- Play icon overlay: 48px, white with 80% opacity, centered

**Content**

- Thumbnail with gradient overlay on hover
- Title: H5, Charcoal
- Speaker: Body S, Slate, with User icon
- Date: Body XS, Silver
- Duration: Body XS, Silver, with Clock icon

#### Ministry Card

**Structure**

- Square aspect ratio
- Background: Gradient based on ministry theme
- Border radius: lg (16px)
- Shadow: Level 2
- Hover: Scale 1.02, shadow Level 3

**Content**

- Icon: 48px, white, centered at top
- Title: H4, white, centered
- Description: Body S, white with 90% opacity, centered, 2-line clamp
- Link: Invisible overlay for full card click

#### Testimony Card

**Structure**

- Background: Pure White
- Border: 2px with Accent border color
- Border radius: lg (16px)
- Padding: 32px
- Shadow: Level 1

**Content**

- Quote icon: 32px, Light Purple, top-left
- Testimony text: Body M, Charcoal, italic, max 4 lines
- Divider: 1px Subtle border, 24px margin
- Name: H6, Charcoal
- Role/Location: Body S, Slate

### 2.4 Buttons

#### Primary Button

- Background: Royal Purple
- Text: White, Inter 16px Weight 600
- Padding: 14px 32px
- Border radius: sm (8px)
- Shadow: Purple Glow
- Hover: Background to Deep Purple, shadow intensifies, lift 2px
- Active: Scale 0.98
- Disabled: 40% opacity, no hover effects
- Icon: 20px, 8px gap from text

#### Secondary Button

- Background: Regal Gold
- Text: Charcoal, Inter 16px Weight 600
- Other properties same as Primary
- Shadow: Gold Shimmer
- Hover: Background to Antique Gold

#### Outline Button

- Background: Transparent
- Border: 2px Royal Purple
- Text: Royal Purple, Inter 16px Weight 600
- Padding: 12px 32px (adjusted for border)
- Hover: Background Light Purple, border Deep Purple
- No shadow by default, Level 1 on hover

#### Ghost Button

- Background: Transparent
- Text: Royal Purple, Inter 16px Weight 600
- Padding: 12px 24px
- Hover: Background Light Purple with 20% opacity
- No border, no shadow

#### Text Link Button

- Text: Royal Purple, Inter 16px Weight 600
- Underline: 2px, appears on hover (slide in from left)
- Icon: Arrow right, 16px, moves 4px right on hover
- No background, no padding

#### Button Sizes

- **Small**: 12px 24px padding, 14px text
- **Medium**: 14px 32px padding, 16px text (default)
- **Large**: 16px 40px padding, 18px text
- **XL**: 20px 48px padding, 20px text (hero CTAs)

### 2.5 Forms & Inputs

#### Text Input

**Structure**

- Height: 48px
- Background: Pure White
- Border: 2px Subtle border
- Border radius: sm (8px)
- Padding: 12px 16px
- Font: Inter 16px Regular
- Color: Charcoal

**States**

- Focus: Border Royal Purple, shadow Level 1 with Purple Glow
- Error: Border Error Red, helper text in Error Red below
- Success: Border Success Green, checkmark icon right
- Disabled: Background Pearl, text Silver, no interaction

**Label**

- Font: Inter 14px Weight 600
- Color: Charcoal
- Margin bottom: 8px
- Required indicator: Red asterisk

**Helper Text**

- Font: Inter 12px Regular
- Color: Slate
- Margin top: 6px

#### Textarea

- Same as Text Input
- Min height: 120px
- Resize: Vertical only
- Max height: 300px

#### Select Dropdown

- Same base styling as Text Input
- Chevron icon: 20px, right-aligned with 16px margin
- Dropdown panel: Pure White background, shadow Level 3, border radius md
- Options: 14px Inter, 12px vertical padding, hover Light Purple background
- Selected: Royal Purple text, checkmark icon

#### Checkbox

- Size: 20px square
- Border: 2px Subtle border
- Border radius: xs (4px)
- Checked: Background Royal Purple, white checkmark
- Focus: Outline 2px Royal Purple with 2px offset
- Label: 14px Inter, 8px left margin

#### Radio Button

- Size: 20px circle
- Border: 2px Subtle border
- Selected: Border Royal Purple, inner circle 10px Royal Purple
- Focus: Same as checkbox
- Label: Same as checkbox

#### Toggle Switch

- Width: 44px, Height: 24px
- Background: Silver (off), Royal Purple (on)
- Circle: 18px, white, 3px margin
- Transition: 200ms ease-out
- Label: 14px Inter, 12px left margin

### 2.6 Modals

#### Standard Modal

**Structure**

- Max width: 600px
- Background: Pure White
- Border radius: xl (24px)
- Shadow: Level 5
- Padding: 40px
- Overlay: rgba(0, 0, 0, 0.5) backdrop blur

**Header**

- Title: H3, Charcoal
- Close button: 24px X icon, top-right, Ghost button style
- Divider: 1px Subtle border, 24px below title

**Body**

- Content area with scroll if needed
- Max height: 70vh

**Footer**

- Divider: 1px Subtle border, 24px above
- Buttons: Right-aligned, 12px gap
- Primary action: Primary Button
- Secondary action: Outline Button

#### Full-Screen Modal (Mobile)

- Full viewport
- Slide up animation from bottom
- Header: Sticky with close button
- Body: Scrollable
- Footer: Sticky at bottom

### 2.7 Tables

#### Data Table

**Structure**

- **Container**: `bg-white`, `rounded-2xl`, `border border-gray-100`, `shadow-sm`, `overflow-hidden`.
- **Responsive**: Horizontal scroll on small screens.

**Header Row**

- **Background**: `bg-gray-50/50` (Translucent gray).
- **Border**: Bottom `border-gray-100`.
- **Typography**: `text-[10px]`, `font-bold`, `uppercase`, `tracking-widest`, `text-gray-400`.
- **Padding**: `px-6 py-4`.

**Body Rows**

- **Background**: White, hover `bg-gray-50/50`.
- **Border**: Bottom `border-gray-100` (divider).
- **Typography**: `text-sm`, `font-medium`, `text-gray-600`.
- **Padding**: `px-6 py-4`.
- **Transition**: Smooth color transition on hover.

**Actions Column**

- **Alignment**: Right.
- **Visibility**: Icons (View, Edit, Delete) appear/opacity-increase on row hover (desktop).
- **Buttons**: Ghost variant, rounded-full, distinct hover colors (Violet, Blue, Red).

**Pagination**

- Below table, 24px margin
- Page numbers: Ghost buttons
- Active page: Primary button style
- Previous/Next: Outline buttons with icons

**Mobile Table**

- Stack as cards
- Each row becomes a card with label: value pairs
- Border radius: md (12px)
- 16px gap between cards

### 2.8 Tags & Badges

#### Status Badge (Event, Registration)

- Padding: 6px 12px
- Border radius: full
- Font: Label S, Montserrat
- Background and text color based on status (see Event Card)

#### Category Tag

- Padding: 4px 10px
- Border radius: xs (4px)
- Font: Label S, Montserrat
- Background: Light Purple with 30% opacity
- Text: Deep Purple
- Border: 1px Deep Purple with 20% opacity

#### Count Badge

- Size: 24px circle
- Background: Error Red
- Text: White, 12px Weight 700
- Position: Absolute top-right with -8px offset
- Used on notification icons

### 2.9 Alerts & Notifications

#### Alert Banner

**Structure**

- Width: 100%
- Padding: 16px 24px
- Border radius: md (12px)
- Border left: 4px solid (color based on type)
- Shadow: Level 1

**Types**

- **Info**: Background Azure Mist, border Info Cyan, icon Info
- **Success**: Background Success Green with 10% opacity, border Success Green, icon CheckCircle
- **Warning**: Background Warning Amber with 10% opacity, border Warning Amber, icon AlertTriangle
- **Error**: Background Error Red with 10% opacity, border Error Red, icon XCircle

**Content**

- Icon: 20px, left-aligned, colored
- Title: Inter 14px Weight 600, Charcoal, 8px left of icon
- Message: Inter 14px Regular, Slate, 4px below title
- Close button: 20px X icon, right-aligned, Ghost style

#### Toast Notification

**Structure**

- Max width: 400px
- Background: Pure White
- Border radius: md (12px)
- Shadow: Level 4
- Padding: 16px
- Position: Fixed top-right, 24px margin
- Animation: Slide in from right, fade out after 5s

**Content**

- Same as Alert Banner but more compact
- Auto-dismiss or manual close

### 2.10 Footer Layout

#### Desktop Footer

**Structure**

- Background: Charcoal
- Text: White
- Padding: 80px horizontal, 64px vertical
- Border top: 4px Regal Gold

**Layout** (4-column grid)

- **Column 1**: Ministry logo (white version), tagline, social icons
- **Column 2**: Quick Links (Home, About, Events, Contact)
- **Column 3**: Resources (Sermons, Blog, Prayer, Give)
- **Column 4**: Contact info, newsletter signup

**Content Styling**

- Column headings: Inter 16px Weight 700, uppercase, letter-spacing 0.08em, Regal Gold
- Links: Inter 14px Regular, white with 80% opacity, hover to 100% and underline
- Social icons: 24px, white with 70% opacity, hover to 100% and scale 1.1
- Newsletter input: White background, 40px height, inline with button

**Bottom Bar**

- Border top: 1px white with 20% opacity
- Padding: 24px top
- Copyright: Body S, white with 60% opacity, left-aligned
- Legal links: Body S, white with 60% opacity, right-aligned, 24px gap

#### Mobile Footer

- Single column stack
- 48px vertical padding
- Same content, reorganized vertically
- Social icons: Centered row
- Newsletter: Full width

### 2.12 Skeleton Loaders

**Primitive (`Sk`)**

- Class: `animate-pulse bg-gray-200 rounded-lg`
- Usage: Building block for all loading states.
- Concept: Mimic the shape and size of text/containers, not the exact content.

**Dashboard Skeleton**

- Nav: Placeholder for search and actions.
- Content: Grid of cards for data overview.
- Sidebar: Placeholder block for contextual info.

**Detail Skeleton**

- Header: Title and action buttons.
- Hero: Large banner block.
- Content: Text blocks and info grids.
- Usage: `Suspense` fallback or `isLoading` state.

### 2.11 Mobile Navigation Patterns

#### Bottom Navigation (Optional for App-like Experience)

- Fixed bottom, full width
- Height: 64px
- Background: Pure White
- Shadow: Level 4 (inverted, top shadow)
- 4-5 items: Home, Events, Sermons, Give, More
- Icons: 24px, centered above labels
- Labels: 10px Inter, centered below icons
- Active: Royal Purple icon and text
- Inactive: Silver icon and text

#### Slide-Out Menu

- Triggered by hamburger
- Slides from right
- Full height, 80% width (max 320px)
- Background: Pure White
- Shadow: Level 5
- Overlay: 50% black backdrop

#### Accordion Navigation (for nested menus)

- Parent item: 48px height, chevron right
- Tap to expand: Chevron rotates down, children slide in
- Children: Indented 24px, 40px height
- Animation: 300ms ease-out

---

## 3. Church Landing Page UX Structure

### 3.1 Hero Banner

- Full viewport height hero with Divine Glory gradient
- Centered headline: "Transforming Lives Through Christ"
- Subheadline: Ministry mission statement
- Two CTAs: "Visit Us" (Primary) and "Watch Online" (Outline)
- Scroll indicator at bottom

### 3.2 Ministry Introduction

- Background: Pure White
- Two-column layout (image left, text right on desktop)
- Image: High-quality photo of church service or pastor
- Eyebrow: "Welcome to [Ministry Name]"
- Heading: "A Community of Faith, Hope, and Love"
- Body text: 2-3 paragraphs about the ministry
- CTA: "Learn Our Story" (Text Link)

### 3.3 Vision Highlights

- Background: Soft Purple Wash
- Three-column grid (stacks on mobile)
- Each column: Icon (48px), heading, short description
- Icons: Cross, Heart, Globe (representing Faith, Love, Mission)
- Centered layout

### 3.4 Upcoming Event Spotlight

- Background: Pure White
- Large featured event card (horizontal layout on desktop)
- Event image left (50% width)
- Event details right: Title, date, venue, description
- Countdown timer if event is within 30 days
- CTA: "Register Now" (Primary Button)
- Link to all events: "View All Events" (Text Link)

### 3.5 Sermon Preview

- Background: Ethereal Blue gradient
- Heading: "Latest Messages"
- Grid of 3 sermon cards (most recent)
- Each card: Thumbnail, title, speaker, date
- CTA: "Explore All Sermons" (Outline Button, centered below grid)

### 3.6 Call-to-Action Blocks

- Background: Divine Glory gradient
- White text
- Centered content
- Heading: "Join Us This Sunday"
- Service times and location
- Two CTAs: "Plan Your Visit" and "Watch Live"

### 3.7 Testimonials

- Background: Pure White
- Heading: "Lives Transformed"
- Carousel of 3 testimony cards (auto-rotate every 6s)
- Navigation dots below
- Manual navigation arrows

### 3.8 Media Section

- Background: Charcoal
- White text
- Two-column grid
- Left: YouTube channel preview with subscriber count
- Right: Spotify/Podcast preview with latest episode
- CTAs for each platform

### 3.9 Giving Section

- Background: Gold Whisper
- Centered content
- Heading: "Partner With Us"
- Description of how giving supports the ministry
- CTA: "Give Now" (Secondary Button - Gold)
- Secure payment badges below

### 3.10 Newsletter Signup

- Background: Pure White
- Centered content, max-width 600px
- Heading: "Stay Connected"
- Description: "Get weekly updates, prayer requests, and event invitations"
- Email input with inline "Subscribe" button
- Privacy note below

### 3.11 Footer

- As described in Component Design Language section

---

## 4. Event Portal UX

### 4.1 Event List Layout

- Page hero: "Events" title, breadcrumb, search bar
- Filter bar below hero: Sticky on scroll
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- Each item: Event Card (as described in components)
- Load more button or infinite scroll

### 4.2 Filtering UI

**Filter Bar**

- Background: Pure White
- Border bottom: 2px Subtle border
- Padding: 16px 24px
- Sticky position when scrolling

**Filter Options**

- Status dropdown: All, Upcoming, Ongoing, Completed
- Date range picker: Custom range or presets (This Month, Next 3 Months, etc.)
- Category tags: Conferences, Workshops, Retreats, etc. (multi-select)
- Sort dropdown: Date (Newest/Oldest), Alphabetical

**Active Filters**

- Display as removable tags below filter bar
- Clear all button on right

### 4.3 Card Design

- Event Card as described in Component Design Language
- Hover reveals quick actions: Share, Add to Calendar
- Click anywhere on card navigates to event microsite

### 4.4 Featured Event Presentation

- Top of page, above filter bar
- Full-width banner with event image background
- Overlay gradient for text readability
- Large event title, date, CTA
- "Featured Event" badge top-left

### 4.5 Empty State

- When no events match filters
- Centered icon (Calendar X, 64px)
- Heading: "No Events Found"
- Description: "Try adjusting your filters"
- CTA: "Clear Filters" or "View All Events"

---

## 5. Event Microsite UX

### 5.1 Hero with Event Branding

- Height: 600px desktop, 400px mobile
- Background: Event-specific image or gradient
- Overlay: Dark Veil for text readability
- Content centered or left-aligned
- Event logo/graphic if available
- Event title: Display L
- Tagline/theme: Body XL
- Date, time, venue with icons
- Status badge: Top-right
- Countdown timer: If upcoming, prominent display
- CTA: "Register Now" (Primary Button, large)

### 5.2 Key Details Strip

- Background: Pure White
- Border top and bottom: 2px Subtle border
- Horizontal scroll on mobile
- Four key info blocks: Date, Time, Location, Price
- Each block: Icon (32px), label, value
- Centered layout

### 5.3 About the Event

- Background: Soft Purple Wash
- Two-column layout (text left, image/video right)
- Heading: "About This Event"
- Body text: Event description, what to expect
- Bullet points for key highlights
- CTA: "Download Event Guide" (PDF link)

### 5.4 Speaker Lineup

- Background: Pure White
- Heading: "Meet the Speakers"
- Grid of speaker cards: 3 columns desktop
- Each card: Photo (circular, 150px), name, title, short bio
- Hover: Scale image slightly, reveal social links
- If many speakers: Carousel with navigation

### 5.5 Schedule

- Background: Ethereal Blue
- Heading: "Event Schedule"
- Timeline layout: Vertical line with time markers
- Each session: Time, title, speaker, location (if multi-room)
- Expandable for full description
- Download schedule button (PDF/iCal)

### 5.6 Registration Section

- Background: Pure White
- Heading: "Secure Your Spot"
- Registration form: Name, email, phone, additional fields
- Ticket type selection if multiple options (General, VIP, etc.)
- Payment integration if paid event
- Terms and conditions checkbox
- Submit button: "Complete Registration" (Primary Button)
- Security badge: "Secure Registration"

### 5.7 Invitation System

- Background: Gold Whisper
- Heading: "Invite Friends"
- Description: "Share this event with your community"
- Email invitation form: Multiple emails, personal message
- Social share buttons: WhatsApp, Facebook, Twitter, Email
- QR code: Generate and display for easy sharing
- Copy link button

### 5.8 Media

- Background: Charcoal
- White text
- Heading: "Event Media"
- Tabs: Photos, Videos, Resources
- Photo gallery: Grid with lightbox on click
- Video embeds: YouTube/Vimeo
- Resources: Downloadable PDFs, links

### 5.9 FAQs

- Background: Pure White
- Heading: "Frequently Asked Questions"
- Accordion layout: Question (H5), answer (Body M)
- Chevron icon rotates on expand
- 5-8 common questions
- CTA: "Still have questions? Contact us"

### 5.10 Sponsors/Partners (Optional)

- Background: Pearl
- Heading: "Our Partners"
- Logo grid: Grayscale logos, color on hover
- Equal sizing, centered

### 5.11 Footer

- Event-specific footer with ministry branding
- Quick links: Back to all events, ministry home, contact
- Social sharing again
- Standard footer content

---

## 6. Admin Dashboard UX

### 6.1 Navigation Structure

**Sidebar Navigation** (Desktop)

- Width: 260px
- Background: Charcoal
- Text: White
- Fixed position, full height
- Logo at top
- Navigation groups with headings

**Navigation Groups**

1. **Dashboard**: Overview icon
2. **Events**: Calendar icon, expandable
   - All Events
   - Create New
   - Archived
3. **Registrations**: Users icon
4. **Invitations**: Mail icon
5. **Analytics**: BarChart icon
6. **Content**: FileText icon, expandable
   - Pages
   - Sermons
   - Media
   - Blog
7. **Settings**: Settings icon

**Navigation Items**

- Height: 44px
- Padding: 12px 20px
- Font: Inter 14px Weight 500
- Hover: Background white with 10% opacity
- Active: Background Royal Purple, white text, left border 4px Regal Gold
- Icon: 20px, 12px right margin

**User Profile**

- Bottom of sidebar
- Avatar (40px circle), name, role
- Dropdown on click: Profile, Logout

**Mobile Navigation**

- Hamburger menu top-left
- Sidebar slides in from left
- Overlay backdrop

### 6.2 Dashboard Layout

**Top Navigation (`AdminTopNav`)**

- **Structure**: Sticky top bar, `z-30`.
- **Background**: Pure White, border-b `gray-100`.
- **Height**: Auto (padding `py-3 md:py-4`).
- **Mobile**: Displays Page Title (H1).
- **Desktop**:
  - **Left/Center**: Search bar (max-w-sm), gray-50 background, rounded-full.
  - **Right**: Notification bell, Action buttons (e.g., "Add Event"), User profile.
- **Aesthetic**: Clean, minimal, focused on content search and primary actions.

**Main Content Area**

- **Background**: `gray-50` (Light Mode Base).
- **Padding**: `p-4 md:p-6`.
- **Layout**: Flexible vertical stack or grid.
- **Typography**: Headings `text-gray-900`, Subtext `text-gray-500`.

**Dashboard Widgets** (Grid layout)

1. **Stats Overview** (4 cards in row)
   - Total Events, Active Registrations, Pending Invitations, Total Attendance
   - Each card: Icon, number (Display M), label, trend indicator
   - Background: Pure White, border radius lg, shadow Level 1

2. **Recent Activity** (Full width)
   - Table of recent registrations, invitations, event updates
   - Columns: Type, Description, Date, Status
   - Max 10 rows, "View All" link

3. **Upcoming Events** (Half width)
   - List of next 5 events
   - Each item: Event name, date, registration count
   - "Manage" link per event

4. **Quick Actions** (Half width)
   - Large buttons for common tasks
   - Create Event, Export Data, Send Invitation
   - Icon + label, grid layout

### 6.3 Data Visualization Style

**Charts** (Using Recharts or similar)

- Color scheme: Royal Purple, Regal Gold, Heavenly Blue
- Background: Pure White
- Grid lines: Subtle, dashed
- Tooltips: Pure White background, shadow Level 3
- Legends: Bottom-aligned, Inter 12px

**Chart Types**

- Line chart: Registrations over time
- Bar chart: Events by category
- Pie chart: Registration sources
- Area chart: Cumulative attendance

### 6.4 Tables for Registrants

- As described in Component Design Language
- Additional features:
  - Search bar above table
  - Column sorting (click header)
  - Row selection (checkbox left column)
  - Bulk actions: Export, Send Email, Delete
  - Filters: Status, Date range, Event
  - Export button: CSV, Excel, PDF options

**Row Actions**

- Three-dot menu right column
- Dropdown: View Details, Edit, Resend Confirmation, Delete
- Quick view modal on "View Details"

### 6.5 Event Creation Interface

**Multi-Step Form**

- Progress indicator at top: Steps 1-5
- Each step: Full-width form section
- Navigation: Back, Next, Save Draft buttons at bottom

**Steps**

1. **Basic Info**: Title, description, category, status
2. **Date & Location**: Date/time pickers, venue, map integration
3. **Branding**: Upload banner, choose color scheme, upload logo
4. **Registration**: Configure fields, ticket types, capacity
5. **Review & Publish**: Summary of all settings, publish button

**Form Layout**

- Max width: 800px, centered
- Labels above inputs
- Helper text below inputs
- Required fields marked
- Validation on blur and submit
- Error messages inline

**Image Upload**

- Drag-and-drop zone
- Preview thumbnail
- Crop/resize tool
- File size and format requirements shown

**Color Picker**

- Preset ministry colors
- Custom color input (hex)
- Preview of how colors apply to event page

### 6.6 Status Indicators

**Event Status**

- Draft: Silver badge
- Published: Heavenly Blue badge
- Upcoming: Info Cyan badge
- Ongoing: Warning Amber badge, pulsing animation
- Completed: Success Green badge
- Archived: Charcoal badge

**Registration Status**

- Confirmed: Success Green
- Pending: Warning Amber
- Cancelled: Error Red
- Waitlist: Info Cyan

**Invitation Status**

- Sent: Heavenly Blue
- Opened: Info Cyan
- Accepted: Success Green
- Declined: Error Red

### 6.7 Mobile Admin Usability

**Responsive Adaptations**

- Sidebar becomes bottom sheet or slide-out
- Dashboard widgets stack vertically
- Tables become card lists
- Forms: Single column, larger touch targets
- Charts: Simplified, horizontal scroll if needed
- Bulk actions: Moved to floating action button

**Touch Optimizations**

- Minimum touch target: 44px
- Increased spacing between interactive elements
- Swipe gestures: Swipe row left for quick actions
- Pull to refresh on lists

**Critical Actions**

- Create Event: Floating action button, bottom-right
- Quick search: Persistent search bar at top
- Notifications: Badge on bottom nav icon

---

## 7. Design Principles Summary

### 7.1 Visual Hierarchy

- Use size, weight, and color to guide attention
- Most important content: Largest, boldest, brand colors
- Supporting content: Medium size, regular weight, neutral colors
- Metadata: Smallest, lighter weight, muted colors

### 7.2 Consistency

- Reuse components across all pages
- Maintain spacing scale throughout
- Apply color palette systematically
- Use same interaction patterns (hover, click, etc.)

### 7.3 Accessibility

- Color contrast: Minimum WCAG AA (4.5:1 for text)
- Focus indicators: Visible on all interactive elements
- Alt text: All images and icons
- Keyboard navigation: Full support
- Screen reader: Semantic HTML, ARIA labels
- Font size: Minimum 16px for body text

### 7.4 Performance

- Optimize images: WebP format, lazy loading
- Minimize animations: Respect prefers-reduced-motion
- Code splitting: Load only what's needed per page
- Caching: Aggressive caching for static assets
- CDN: Serve assets from edge locations

### 7.5 Responsive Design

- Mobile-first approach
- Breakpoints at 640px, 1024px, 1440px
- Fluid typography: Scale between breakpoints
- Touch-friendly: 44px minimum touch targets on mobile
- Test on real devices

### 7.6 Spiritual Aesthetic

- Avoid overly corporate or commercial feel
- Use imagery that inspires: Light, community, worship
- Typography: Balance modern with timeless
- Colors: Regal and uplifting, not trendy
- Whitespace: Generous, creates breathing room and reverence
- Avoid clutter: Every element should have purpose

---

This design system provides a comprehensive foundation for building a premium, spiritually uplifting ministry platform. All components are designed to work together harmoniously while maintaining flexibility for event-specific customization.
