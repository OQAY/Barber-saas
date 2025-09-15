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

### Git Hooks & Quality
```bash
# Pre-commit hooks run automatically via Husky:
# - ESLint fixes
# - Prettier formatting
# - Commit message linting

# Manual quality checks:
npm run lint          # Check for linting issues
npm run build         # Verify production build
```

## Architecture Overview

### Core Stack
- **Next.js 14** with App Router (`src/app/`)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth with Google OAuth and Credentials provider (email/password with bcrypt)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Server Components + NextAuth session management

### Data Flow Architecture
1. **Client Components** (`"use client"`) handle user interactions and client-side state
2. **Server Components** (default) fetch data directly from database via Prisma
3. **Server Actions** (`_actions/`) handle mutations (bookings, cancellations)
4. **API Routes** (`api/`) handle NextAuth authentication endpoints
5. **Database** queries go through centralized Prisma client (`_lib/prisma.ts`)

### Key Directories
```
src/app/
├── _actions/          # Server Actions for database operations
├── _components/       # Shared React components (organized by domain)
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # header, footer, sidebar-sheet, hero-section
│   ├── home/         # about-section
│   ├── barbershop/   # barbershop-item
│   ├── booking/      # booking-item, booking-summary  
│   ├── staff/        # barber-item, barber-specialties
│   ├── auth/         # sign-in-dialog
│   └── common/       # search, service-items, phone-item, quick-search
├── _lib/             # Utilities and configurations
│   ├── Auth.ts       # NextAuth configuration
│   ├── prisma.ts     # Prisma client singleton
│   └── utils.ts      # Utility functions
├── _constants/       # Application constants
│   ├── search.ts     # Service categories/quick search items
│   └── specialties.ts # Barber specialties configuration
├── api/              # API routes (NextAuth endpoints)
├── barbershops/      # Barbershop listing and detail pages
├── barbers/[slug]/   # Individual barber pages (uses slug for SEO-friendly URLs)
├── bookings/         # User bookings management
├── login/            # Authentication pages
└── register/         # User registration
```

### Database Schema Key Models
- **User**: NextAuth user with role system (USER, BARBER, MANAGER, OWNER)
- **Barbershop**: Business listings with services and associated barbers
- **Barber**: Individual barbers with slugs, specialties, and working hours
- **BarbershopService**: Services offered by barbershops
- **Booking**: Reservations linking users, services, and barbers with specific date/time

### Authentication & Authorization
- **Providers**: Google OAuth + Credentials (email/password)
- **Session Strategy**: JWT with database adapter
- **Protected Routes**: Check session via `getServerSession(authOptions)`
- **Role-Based Access**: UserRole enum (USER, BARBER, MANAGER, OWNER)

## Development Patterns

### Component Patterns
- **Server Components by default**: Data fetching happens on server
- **Client Components** only when needed (interactions, hooks, browser APIs)
- **Domain Organization**: Components grouped by feature/domain
- **Server Actions**: All mutations go through `_actions/` directory
- **Type Safety**: Prisma generates TypeScript types from schema

### Routing Patterns
- **Dynamic Routes**: Use slugs for SEO (`barbers/[slug]`) instead of IDs
- **Parallel Data Fetching**: Multiple database queries in parallel in Server Components
- **Loading States**: Use `loading.tsx` files for route-level loading
- **Error Boundaries**: Use `error.tsx` files for error handling

### Database Patterns
- **Singleton Client**: Import from `_lib/prisma.ts` to avoid connection issues
- **Transactions**: Use Prisma transactions for multi-step operations
- **Optimistic Updates**: Update UI optimistically, rollback on error
- **Type Generation**: Run `npx prisma generate` after schema changes

## Environment Setup

Required environment variables in `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Testing & Quality

### Pre-commit Checks (Automatic via Husky)
- ESLint with auto-fix
- Prettier formatting
- Commit message validation

### Manual Verification
```bash
npm run lint          # Check ESLint issues
npm run build         # Ensure production build works
npx tsc --noEmit      # Type checking without emitting files
```

## Common Tasks

### Adding a New Feature
1. Create Server Action in `_actions/` if data mutation needed
2. Create components in appropriate `_components/` subdirectory
3. Add route in `app/` directory structure
4. Update Prisma schema if new data model needed
5. Run `npx prisma migrate dev` to create migration
6. Run `npx prisma generate` to update TypeScript types

### Working with Barbers
- Barbers use slugs for URLs (SEO-friendly)
- Run `src/scripts/populate-slugs.ts` to generate slugs for existing barbers
- Specialties are defined in `_constants/specialties.ts`

### Handling Bookings
- Create booking: `_actions/create-booking.ts`
- Cancel booking: `_actions/cancel-booking.ts`  
- Get bookings: `_actions/get-bookings.ts`
- Bookings include barberId to track which barber serves the client