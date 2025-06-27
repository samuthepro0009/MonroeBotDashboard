# Project Overview

This is a modern full-stack web application built with React, Express, TypeScript, and PostgreSQL. The project follows a clean architecture pattern with a clear separation between client and server code, shared schemas, and a comprehensive UI component library.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Tailwind CSS** for styling with a custom design system
- **shadcn/ui** component library for consistent UI components
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **React Hook Form** with **Zod** validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure with `/api` prefix for all endpoints
- **Middleware-based** request/response handling with logging
- **Modular routing** system in `server/routes.ts`
- **Abstract storage interface** allowing for multiple data persistence strategies

### Data Layer
- **Drizzle ORM** with PostgreSQL for database operations
- **Type-safe** schema definitions shared between client and server
- **Zod schemas** for runtime validation derived from database schemas
- **In-memory storage** implementation for development/testing
- **Migration system** using Drizzle Kit

## Key Components

### Shared Schema (`shared/schema.ts`)
- Centralized database schema definitions using Drizzle ORM
- Auto-generated TypeScript types for compile-time safety
- Zod validation schemas derived from database schemas
- Currently includes a basic `users` table with username/password authentication

### Storage Abstraction (`server/storage.ts`)
- **IStorage interface** defines all data operations
- **MemStorage class** provides in-memory implementation for development
- **Pluggable architecture** allows easy switching to database-backed storage
- **CRUD operations** for user management (create, read by ID, read by username)

### Client Architecture
- **Component-based** React application with TypeScript
- **Custom hooks** for mobile detection and toast notifications
- **Utility functions** for CSS class management (cn function)
- **Query client** configuration with automatic error handling and retry logic
- **API request abstraction** with built-in error handling and authentication

### UI System
- **Comprehensive component library** based on Radix UI primitives
- **Consistent design tokens** via CSS custom properties
- **Dark/light theme support** built into the design system
- **Responsive design** patterns with mobile-first approach
- **Accessibility-focused** components with proper ARIA support

## Data Flow

### Request Lifecycle
1. Client makes API requests through the `apiRequest` utility function
2. Express middleware logs requests and adds request timing
3. Routes are processed through the modular routing system
4. Storage operations are performed through the IStorage interface
5. Responses are automatically logged with status codes and timing

### State Management
- **Server state** managed by TanStack Query with automatic caching
- **Form state** handled by React Hook Form with Zod validation
- **UI state** managed by React's built-in state management
- **Toast notifications** for user feedback via custom hook

### Development Workflow
- **Hot module replacement** via Vite for fast development
- **TypeScript compilation** with strict type checking
- **Automatic server restart** on file changes
- **Database migrations** managed by Drizzle Kit

## External Dependencies

### Core Runtime Dependencies
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod for runtime type checking
- **HTTP Client**: Built-in fetch API with custom wrapper
- **UI Components**: Radix UI primitives for accessibility

### Development Dependencies
- **Build Tools**: Vite for bundling and development server
- **Type Checking**: TypeScript with strict configuration
- **CSS Processing**: Tailwind CSS with custom configuration
- **Database Migrations**: Drizzle Kit for schema management

### Third-party Integrations
- **Replit Environment**: Configured for seamless cloud development
- **Auto-scaling Deployment**: Built-in deployment configuration
- **Development Banner**: Replit development mode indicator

## Deployment Strategy

### Production Build
- **Multi-stage process**: Client build followed by server preparation
- **Static asset serving**: Express serves built client files
- **Auto-scaling**: Configured for automatic horizontal scaling
- **Port configuration**: Flexible port mapping (5000 internal, 80 external)

### Development Environment
- **Parallel execution**: Client and server run simultaneously
- **Hot reloading**: Instant feedback during development
- **Database provisioning**: Automatic PostgreSQL setup
- **Environment isolation**: Separate development and production configurations

### Database Strategy
- **Migration-based**: All schema changes tracked in version control
- **Type-safe operations**: Compile-time guarantees for database interactions
- **Connection management**: Environment-based database URL configuration
- **Development flexibility**: In-memory storage for rapid prototyping

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```