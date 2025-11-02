# Actor's Tool Randomizer

## Overview

Actor's Tool Randomizer is a web application designed to help actors practice theatrical techniques through randomized tool selection. The app provides a theatrical, focused experience where users select from various acting methodology categories (PsychoPhysical Gestures, Characterization, Tempo/Rhythm, etc.) and draw random tools to practice. The interface balances dramatic reveal experiences inspired by tarot/oracle card applications with clean, efficient utility design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing with a simple route structure (Home page and 404 fallback).

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with the "new-york" style preset.

**Styling Approach**: 
- Tailwind CSS for utility-first styling with custom design tokens
- CSS custom properties for theming (light/dark mode support)
- Custom color palette using HSL values for consistent theming
- Typography hierarchy using Inter (primary) and Playfair Display (theatrical emphasis)

**State Management**: 
- React hooks for local component state
- TanStack Query for server state management and caching
- Context API for theme management

**Design Philosophy**: Hybrid approach combining dramatic, ceremonial reveal experiences with efficient selection interfaces. Full viewport height utilization for immersive experience with theatrical flair balanced by functional utility.

### Backend Architecture

**Runtime**: Node.js with Express server framework.

**Language**: TypeScript with ES modules enabled.

**Server Structure**:
- Express middleware for JSON parsing and request logging
- Vite development server integration with HMR support
- Modular route registration system
- In-memory storage implementation (MemStorage class)

**Development/Production Split**: 
- Development mode uses Vite middleware for hot module replacement
- Production mode serves static built assets
- Conditional plugin loading for Replit-specific tooling

### Data Layer

**Schema Definition**: Zod schemas for runtime type validation and TypeScript type inference.

**Data Models**:
- `ToolCategory`: Grandparent level containing multiple parent tools with optional descriptions and scale support
- `ParentTool`: Individual tools with optional children (up to 100 specific examples)
- `DrawnTool`: Records of tools drawn during sessions with timestamps and scale values

**Database Configuration**: Drizzle ORM configured for PostgreSQL with Neon serverless adapter, though currently using in-memory storage.

**Storage Architecture**: 
- Interface-based storage design (IStorage) for flexibility
- Current implementation uses MemStorage for session-based data
- Database migrations configured in `/migrations` directory
- Schema located in `/shared` for type sharing between client and server

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible component foundations
- Lucide React for iconography
- embla-carousel-react for carousel functionality
- cmdk for command palette interface

**Utility Libraries**:
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional className composition
- date-fns for timestamp formatting
- nanoid for unique ID generation

**Database & Backend**:
- @neondatabase/serverless for PostgreSQL database connection
- drizzle-orm and drizzle-kit for database operations and migrations
- connect-pg-simple for PostgreSQL session storage (configured but not actively used)

**Form & Validation**:
- react-hook-form for form state management
- @hookform/resolvers for validation schema integration
- zod for schema validation

**Development Tools**:
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)
- TypeScript for type safety across the stack
- PostCSS with Tailwind and Autoprefixer

**Fonts**: Google Fonts integration for Inter and Playfair Display font families.