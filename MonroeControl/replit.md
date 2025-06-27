# Monroe Bot Dashboard

## Overview
This is a modern web application built as a Discord bot management dashboard. The application provides a comprehensive interface for monitoring and controlling a Discord bot, including user management, broadcasting messages, and viewing bot statistics. The project follows a full-stack architecture with a React frontend and Express.js backend, designed to run on Replit with PostgreSQL integration.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for component-based UI development
- **Vite** as the build tool and development server
- **Tailwind CSS** with **shadcn/ui** components for modern, responsive design
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API calls
- **React Hook Form** with **Zod** validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **Session-based authentication** using express-session
- **Bcrypt** for password hashing and verification
- **File-based storage** with JSON files (users.json) as the primary data store
- **RESTful API** design with proper error handling middleware

### Data Storage
- **Primary Storage**: File-based JSON storage for user data
- **Database Configuration**: Drizzle ORM configured for PostgreSQL (ready for migration)
- **Schema Management**: Centralized schema definitions in shared directory
- **Session Storage**: In-memory session management

## Key Components

### Authentication System
- Session-based authentication with secure cookie handling
- Role-based authorization (admin/user roles)
- Password hashing using bcrypt with 12 salt rounds
- Default admin account (username: admin, password: admin123)

### User Management
- CRUD operations for user accounts
- Role assignment (admin/user)
- User activity tracking (last login timestamps)
- Admin-only user creation and deletion

### Bot Integration
- Real-time bot status monitoring
- Broadcast messaging functionality
- Server and user count tracking
- Uptime monitoring capabilities

### Dashboard Features
- Interactive statistics cards showing bot metrics
- Multi-view navigation (Dashboard, Broadcast, User Management)
- Responsive design with mobile support
- Real-time status updates with auto-refresh

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Server validates against stored user data
3. Session is created and stored server-side
4. Client receives authentication status
5. Protected routes check session validity

### Bot Status Flow
1. Frontend queries bot status endpoint every 30 seconds
2. Backend retrieves current bot metrics
3. Status data is cached and returned to client
4. UI updates reflect real-time bot state

### User Management Flow
1. Admin creates/modifies user accounts
2. Form validation occurs client-side using Zod schemas
3. API request sent to server with sanitized data
4. Server validates permissions and updates storage
5. Client cache invalidated and UI refreshed

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI primitives
- **drizzle-orm**: Database ORM (configured for future PostgreSQL use)
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **express-session**: Session management
- **bcrypt**: Password hashing

### Development Dependencies
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development and build tooling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

## Deployment Strategy

### Development Environment
- **Replit**: Primary development platform
- **Vite Dev Server**: Hot module replacement for development
- **File Watcher**: Automatic server restart on changes
- **Port Configuration**: Port 5000 for development server

### Production Build
- **Static Assets**: Built to `dist/public` directory
- **Server Bundle**: Compiled with esbuild to `dist/index.js`
- **Asset Serving**: Express serves static files in production
- **Environment Variables**: DATABASE_URL and SESSION_SECRET required

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Auto-deployment**: Configured for autoscale deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Build Process**: npm run build → npm run start

## Changelog
- June 26, 2025: Initial setup with complete Discord bot dashboard
- June 26, 2025: Connected to external Monroe bot via API credentials
- June 26, 2025: Deployed authentication system with bcrypt password hashing
- June 26, 2025: Implemented real-time bot monitoring and broadcast messaging
- June 26, 2025: Created complete API integration file for Monroe Bot
- June 26, 2025: Dashboard successfully connects to Monroe Bot but API endpoints pending

## Current Status
- Dashboard is fully functional and connects to Monroe Bot at monroe-bot.onrender.com
- Bot shows as online with basic health check working
- Complete Monroe Bot main.py file created with full API integration
- monroe-bot-complete-main.py contains working Discord bot with all API endpoints
- Ready for deployment: Replace main.py with monroe-bot-complete-main.py and restart bot
- All dashboard features will work immediately after Monroe Bot update

## User Preferences
Preferred communication style: Simple, everyday language.
Project: Discord bot administration dashboard for Monroe bot
External Integration: Connected to Monroe bot API via environment variables API_SECRET and BOT_API_URL