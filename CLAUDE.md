# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FSW Barber is a Next.js 14 barbershop booking application with TypeScript, featuring user authentication via NextAuth, a PostgreSQL database with Prisma ORM, and a responsive UI built with Tailwind CSS and shadcn/ui components.

## Development Commands

### Core Development Commands
```bash
npm run dev           # Start development server on http://localhost:3000
npm run build         # Prisma generate + Next.js build for production
npm run start         # Start production server
npm run lint          # Run ESLint linting
npm install           # Install dependencies + run Prisma generate (postinstall hook)
```

### Database Commands
```bash
npx prisma generate       # Generate Prisma client after schema changes
npx prisma migrate dev    # Create and apply new migration
npx prisma db push        # Push schema changes without migration
npx prisma studio         # Open Prisma Studio database browser
npx prisma db seed        # Run database seeder (prisma/seed.ts)
```

### Testing Commands
```bash
# Unit Tests (Jest)
npm run test              # Run all unit tests
npm run test:watch        # Run tests in watch mode for development
npm run test:coverage     # Run tests with coverage report
npm run test -- --testNamePattern="specific test"  # Run specific test

# E2E Tests (Playwright)
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run E2E tests with visual interface
npm run test:e2e:headed   # Run E2E tests visible in browser
npx playwright install   # Install browser dependencies

# Combined Testing
npm run test:all          # Run both unit and E2E tests
npm run test:ci           # Run tests for CI/CD (coverage + E2E)
```

### Quality & Git Hooks
```bash
# Pre-commit hooks run automatically via Husky:
# - lint-staged (ESLint + Prettier)
# - Git commit message validation

# Manual quality checks:
npm run lint          # Check for linting issues
npm run build         # Verify production build works
npx tsc --noEmit      # Type checking without emitting files
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
│   ├── utils.ts      # Utility functions
│   ├── logger.ts     # Professional logging system
│   └── validations.ts # Zod validation schemas
├── _constants/       # Application constants
│   ├── search.ts     # Service categories/quick search items
│   ├── specialties.ts # Barber specialties configuration
│   └── company.ts    # Business constants and configuration
├── api/              # API routes (NextAuth endpoints)
├── barbershops/      # Barbershop listing and detail pages
├── barbers/[slug]/   # Individual barber pages (uses slug for SEO-friendly URLs)
├── bookings/         # User bookings management
├── login/            # Authentication pages
└── register/         # User registration
```

### Database Schema Key Models
- **User**: NextAuth user with role system (USER, BARBER, MANAGER, OWNER), supports email/password and OAuth
- **Barbershop**: Business listings with services and associated barbers
- **Barber**: Individual barbers with slugs, specialties, working hours, and role hierarchy
- **BarbershopService**: Services offered by barbershops with pricing
- **Booking**: Reservations with status tracking (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- **Account/Session**: NextAuth tables for OAuth and session management

### Authentication & Authorization
- **Providers**: Google OAuth + Credentials (email/password with bcrypt)
- **Session Strategy**: JWT with Prisma database adapter
- **Protected Routes**: Check session via `getServerSession(authOptions)`
- **Role Systems**:
  - UserRole enum (USER, BARBER, MANAGER, OWNER)
  - BarberRole enum (BARBER, MANAGER, OWNER)
- **Password Security**: bcrypt hashing for credentials provider

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

### Logging & Monitoring
- **Professional Logging**: Use `logger` from `_lib/logger.ts` instead of console.log
- **Structured Logging**: JSON format in production, readable format in development
- **Performance Logging**: Use `withPerformanceLogging()` for slow operations
- **User Action Tracking**: Use `logger.userAction()` for important user interactions
- **Error Tracking**: Use `logger.error()` and `logger.apiError()` for proper error handling

## Environment Setup

Required environment variables in `.env.local`:
```
# Database (PostgreSQL or Supabase)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Note: This project supports both traditional PostgreSQL and Supabase as database providers.

## Testing & Quality

### Testing Strategy
The project implements comprehensive testing with **50% minimum coverage** across all critical business logic:

**Unit Tests (Jest)**
- **Validation Logic**: All Zod schemas in `_lib/validations.ts`
- **Server Actions**: Critical business operations in `_actions/`
- **Utility Functions**: Helper functions and calculations
- **Error Handling**: Logging and error recovery

**E2E Tests (Playwright)**
- **User Flows**: Complete booking and cancellation workflows
- **Cross-browser**: Chrome, Firefox, Safari, Mobile Chrome/Safari
- **Authentication**: Login/logout flows
- **Responsive Design**: Mobile and desktop layouts

### Test Configuration
- **Jest Config**: `jest.config.js` with Next.js integration
- **Playwright Config**: `playwright.config.ts` with multi-browser setup
- **Mocks**: Database mocks in `src/app/_lib/__mocks__/`
- **Coverage**: 50% threshold for branches, functions, lines, statements

### Pre-commit Checks (Automatic via Husky)
- lint-staged runs on staged files (ESLint + Prettier)
- Git commit message validation (git-commit-msg-linter)

### Manual Verification
```bash
npm run lint          # Check ESLint issues
npm run build         # Ensure production build works
npx tsc --noEmit      # Type checking without emitting files
```

### Key Dependencies for Quality
- **Jest**: Unit testing with Next.js integration
- **Playwright**: E2E testing across browsers
- **ESLint**: Next.js ESLint configuration
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict typing throughout the application
- **Husky**: Git hooks for quality gates

## Common Tasks

### Adding a New Feature
1. Create Server Action in `_actions/` if data mutation needed
2. Add unit tests for Server Actions in `_actions/__tests__/`
3. Create components in appropriate `_components/` subdirectory
4. Add route in `app/` directory structure
5. Update Prisma schema if new data model needed
6. Run `npx prisma migrate dev` to create migration
7. Run `npx prisma generate` to update TypeScript types
8. Add E2E tests for user workflows in `tests/e2e/`
9. Run `npm run test:coverage` to ensure coverage targets are met

### Working with Barbers
- Barbers use slugs for URLs (SEO-friendly)
- Run `src/scripts/populate-slugs.ts` to generate slugs for existing barbers
- Specialties are defined in `_constants/specialties.ts`

### Handling Bookings
- Create booking: `_actions/create-booking.ts`
- Cancel booking: `_actions/cancel-booking.ts`
- Get bookings: `_actions/get-bookings.ts`
- Bookings include barberId to track which barber serves the client

### Adding Logging
- Use `logger.info()` for general information
- Use `logger.userAction()` for user interactions
- Use `logger.apiError()` for API endpoint errors
- Use `withPerformanceLogging()` for operations that might be slow
- Never use `console.log()` in production code

## Database Configuration

### Current Setup (Supabase)
The project is currently configured to use Supabase as the PostgreSQL provider. Recent commits show stable Supabase configuration with pooler setup for optimal connection management.

### Database Connection Strategy
- Uses Prisma as the ORM layer
- Singleton pattern for Prisma client (`_lib/prisma.ts`)
- Supports both direct connection and connection pooling
- Environment variable `DATABASE_URL` should point to Supabase connection string

### Important Notes
- After any schema changes, run `npx prisma migrate dev` to create migrations
- Run `npx prisma generate` to regenerate the client
- Use `npx prisma studio` to browse data in development
- The seed file (`prisma/seed.ts`) can populate initial data