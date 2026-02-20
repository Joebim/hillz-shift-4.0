# Ministry Platform

A comprehensive digital platform for modern church management and community engagement.

## 🚀 Overview

This project provides a robust solution for managing church operations including:

- **Public Website**: Beautiful, responsive landing pages for events, sermons, ministries, and blog posts.
- **Content Management System (CMS)**: Secure admin dashboard for managing all content.
- **Event Registration**: Complete flow for event signups with email confirmations.
- **Invitation System**: Personalized invitations with tracking.
- **Ministry Directory**: Manage active ministry groups.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) with Session Cookies
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) & [Zustand](https://github.com/pmndrs/zustand)
- **Emails**: [Nodemailer](https://nodemailer.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase Project created

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/ministry-platform.git
    cd ministry-platform
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    - Copy `.env.example` to `.env.local`:
      ```bash
      cp .env.example .env.local
      ```
    - Fill in your **Firebase Configuration** credentials.
    - Add **SMTP credentials** for email functionality.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Admin Access

The platform uses role-based access control.

1.  Navigate to `/admin/login`.
2.  Use the initial admin credentials (configured in Firestore manually or via seeding script).
    - _To create the first admin user, you can use the Firebase Console to create an Auth user, then set their `role` field to `admin` in the corresponding Firestore `users` document._

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `(public)`: Public-facing pages (Homepage, Events, etc.).
  - `admin`: Protected admin dashboard pages.
  - `api`: Backend API endpoints.
- `src/`: Source code including components, hooks, and utilities.
  - `components/`: UI components (Admin, Public, Shared).
  - `lib/`: Utilities (Firebase, Email, Helpers).
  - `types/`: TypeScript interfaces.
  - `schemas/`: Zod validation schemas.

## 📧 Email Configuration

The system uses Nodemailer for transactional emails.
Configure SMTP settings in `.env.local`:

- `SMTP_HOST`: e.g., smtp.gmail.com
- `SMTP_USER`: Your email address
- `SMTP_PASS`: App Password (for Gmail: generated in Google Account security settings)

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
