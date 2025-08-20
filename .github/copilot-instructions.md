# ShootingMatch.App - GitHub Copilot Instructions

## Project Overview

ShootingMatch.App is a modern shooting sports club management platform built with Next.js 15. It provides comprehensive features for user registration, club management, role-based access control, and social authentication.

### Business Domain
- **Primary Focus**: Shooting sports club management
- **Target Users**: Club managers, members, and shooting sports enthusiasts
- **Key Entities**: Users, Clubs, Roles (Member, Manager), Join Requests

## Tech Stack & Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google/Microsoft SSO
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom variants
- **Testing**: Jest with ts-jest preset
- **Build Tool**: Turbopack for development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/            # API endpoints (auth, profile, etc.)
│   ├── clubs/          # Club-related pages
│   └── page.tsx        # Landing page
├── components/         
│   ├── ui/             # Reusable UI components (shadcn/ui style)
│   └── layout/         # Layout components
├── db/                 # Database models and repositories
├── lib/                # Utility functions and shared logic
│   └── passwords/      # Password hashing and validation
├── hooks/              # Custom React hooks
└── middleware.ts       # Next.js middleware
```

## Code Style & Conventions

### Design System
- **Primary Color**: Teal (#009688) - evokes precision and focus
- **Background**: Light grey (#F5F5F5) 
- **Accent**: Bright Orange (#FF5722) - for CTAs and highlights
- **Typography**: Inter font family for both body and headlines
- **Icons**: Lucide React icons, simple and shooting sports-related where applicable

### Component Patterns
- Use **shadcn/ui** component architecture with `cn()` utility for className merging
- Implement **compound component patterns** for complex UI elements
- Use **forwardRef** for components that need DOM access
- Apply **cva (class-variance-authority)** for component variants
- Follow **Radix UI** accessibility patterns

### File Naming
- **Pages**: Use Next.js App Router conventions (`page.tsx`, `layout.tsx`)
- **Components**: PascalCase for component files (`Button.tsx`)
- **Utils**: camelCase for utility files (`utils.ts`)
- **Types**: Use `.types.ts` suffix for type-only files
- **Models**: Use `.model.ts` for database models
- **Tests**: Use `.test.ts` suffix

### Authentication Patterns
- Use **NextAuth.js** for authentication flows
- Support **credential-based** and **social login** (Google, Microsoft)
- Implement **session-based** authentication with JWT tokens
- Use **middleware.ts** for route protection
- Follow **repository pattern** for user data access

## Development Guidelines

### TypeScript Usage
- Use **strict mode** with all strict checks enabled
- Prefer **type inference** over explicit typing where clear
- Use **interface** for object shapes, **type** for unions/intersections
- Implement **generic types** for reusable components
- Use **zod** for runtime validation and schema definition

### Database Patterns
- Use **Mongoose** for MongoDB interactions
- Implement **repository pattern** for data access layer
- Use **model separation** (user.model.ts, user.repository.ts)
- Follow **schema-first** approach with proper validation
- Implement **password hashing** with custom protection schemes

### API Development
- Use **Next.js Route Handlers** in `/api` directory
- Implement **proper error handling** with meaningful HTTP status codes
- Use **middleware** for authentication checks
- Follow **RESTful conventions** for resource endpoints
- Validate **request/response** with TypeScript interfaces

### UI Development
- Build components with **accessibility-first** approach
- Use **Tailwind classes** following the established design system
- Implement **responsive design** with mobile-first approach
- Add **subtle animations** for enhanced UX (hover states, transitions)
- Use **card-based layouts** for information display

### Testing Strategy
- Write **unit tests** with Jest for business logic
- Focus on **password utility functions** and **authentication flows**
- Use **ts-jest** configuration for TypeScript support
- Test **edge cases** (empty inputs, long passwords, special characters)
- Mock **external dependencies** (database, authentication providers)

## Common Tasks & Patterns

### Adding New Components
1. Create component in `/src/components/ui/` following shadcn/ui patterns
2. Use `forwardRef` for DOM access
3. Implement variants with `cva`
4. Add proper TypeScript interfaces
5. Export from component file

### Creating New Pages
1. Add page in appropriate `/app` directory
2. Use proper Next.js metadata API
3. Implement loading and error states
4. Add authentication checks if needed
5. Follow responsive design principles

### Database Operations
1. Define schema in `.model.ts` file
2. Create repository methods in `.repository.ts`
3. Use proper error handling
4. Implement validation with Mongoose schemas
5. Follow the existing password protection patterns

### API Endpoints
1. Create route handler in `/app/api/`
2. Add proper authentication middleware
3. Validate request data
4. Return consistent response format
5. Handle errors gracefully

## Security Considerations
- **Never expose** sensitive configuration in client code
- Use **environment variables** for secrets and API keys
- Implement **proper password hashing** with salt and pepper
- Validate **all user inputs** on both client and server
- Use **HTTPS** and secure session handling
- Follow **OWASP** security guidelines for web applications

## Performance Guidelines
- Use **Next.js Image** component for optimized images
- Implement **proper caching** strategies
- Use **React Server Components** where appropriate
- Optimize **bundle size** with proper imports
- Use **Turbopack** for faster development builds

## Business Logic Notes
- Club managers have **elevated permissions** within their clubs
- Users can **request to join** clubs, requiring manager approval
- Implement **role-based access control** throughout the application
- Support **public club pages** for information sharing
- Focus on **shooting sports terminology** and domain concepts