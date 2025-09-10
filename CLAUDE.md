# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FSW Barber is a Next.js 14 barbershop booking application with TypeScript, featuring user authentication via NextAuth, a PostgreSQL database with Prisma ORM, and a responsive UI built with Tailwind CSS and shadcn/ui components.

## Development Commands

### Core Development Commands
```bash
npm run dev           # Start development server on http://localhost:3000
npm run build         # Build production version
npm run start         # Start production server
npm run lint          # Run ESLint linting
npm run prepare       # Generate Prisma client (runs automatically on install)
```

### Database Commands  
```bash
npx prisma generate       # Generate Prisma client after schema changes
npx prisma migrate dev    # Create and apply new migration
npx prisma db push        # Push schema changes without migration
npx prisma studio         # Open Prisma Studio database browser
npx prisma db seed        # Run database seeder (prisma/seed.ts)
```

## Architecture Overview

### Core Structure
- **Next.js 14** with App Router (`src/app/`)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth with Google OAuth and custom email/password
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Server Components + NextAuth session management

### Key Directories
```
src/app/
├── _actions/          # Server Actions for database operations
├── _components/       # Shared React components (organized by domain)
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # header, footer, sidebar-sheet
│   ├── barbershop/   # barbershop-item
│   ├── booking/      # booking-item, booking-summary
│   ├── auth/         # sign-in-dialog
│   └── common/       # search, service-items, phone-item
├── _lib/             # Utilities and configurations
├── _constants/       # Application constants
├── api/              # API routes (NextAuth endpoints)
├── barbershops/      # Barbershop listing and detail pages
├── bookings/         # User bookings management
├── login/            # Authentication pages
└── register/
```

### Database Schema
- **Users**: Authentication with NextAuth adapter tables
- **Barbershops**: Business listings with services
- **BarbershopServices**: Individual services offered
- **Bookings**: User reservations linking users to services

### Authentication Flow
- **NextAuth** configured in `src/app/_lib/Auth.ts`
- **Google OAuth** and **email/password** providers
- **Session management** via `AuthProvider` wrapper in layout
- **Protected routes** check session status in components

## Development Guidelines

### Component Patterns
- Components use **shadcn/ui** base components from `_components/ui/`
- **Organized by domain**: layout, barbershop, booking, auth, common
- **Server Components** by default, mark with `"use client"` when needed
- **Server Actions** in `_actions/` for database mutations
- **Prisma client** imported from `_lib/prisma.ts`

### Styling Conventions
- **Tailwind CSS** for all styling
- **Dark mode** enabled by default (`className="dark"` in layout)
- **Responsive design** mobile-first approach
- **shadcn/ui** components provide consistent design system

### Database Operations
- Use **Server Actions** for mutations (create, update, delete)
- **Prisma client** for all database queries
- **TypeScript types** auto-generated from Prisma schema
- Database migrations managed via Prisma CLI

### File Organization
- **Page components** in route directories (e.g., `barbershops/[id]/page.tsx`)
- **Shared components** organized by domain in `_components/`:
  - `layout/` - Header, footer, sidebar navigation
  - `barbershop/` - Barbershop-related components  
  - `booking/` - Booking management components
  - `auth/` - Authentication dialogs and forms
  - `common/` - Reusable utility components
- **Business logic** in Server Actions (`_actions/`)
- **Utilities** in `_lib/`

## Environment Setup

Required environment variables in `.env.local`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Testing and Quality

Run these commands before committing:
```bash
npm run lint          # ESLint checks
npm run build         # Ensure production build works
```

The project includes:
- **Husky** git hooks for commit linting
- **lint-staged** for pre-commit checks
- **Prettier** with Tailwind plugin for formatting
- **TypeScript** strict mode enabled