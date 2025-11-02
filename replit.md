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
- `DrawnTool`: Records of tools drawn during sessions with timestamps, scale values, unveiled values, and journal reflections

**Database Configuration**: PostgreSQL database with Drizzle ORM and Neon serverless adapter for persistent storage.

**Storage Architecture**: 
- Interface-based storage design (IStorage) for flexibility
- DatabaseStorage implementation for PostgreSQL persistence
- `drawn_tools` table stores all drawn tools with journal entries
- Schema located in `/shared` for type sharing between client and server
- Database schema managed via `npm run db:push`

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

## Recent Changes

### November 2, 2025 - Category Wheel Layout & UI Improvements
- **Added Ensemble Category**: New 14th category with 6 tools for group dynamics (Listening, Supporting, Leading, Following, Mirroring, Contrasting)
- **Stargate-Style Wheel Layout**: 
  - Implemented "flat bottom" design inspired by Stargate, with circular top/sides and flat bottom
  - Fixed critical bug where "four-brothers" wasn't recognized as fixed category (falsy 0 angle value)
  - 11 individual cards positioned around circular portion constrained to upper 220° arc
  - All cards correctly positioned: Psychological Gesture (12 o'clock), Four Brothers (3 o'clock), Characterization (9 o'clock)
  - 8 remaining categories evenly distributed across upper arc to prevent overlaps
  - Radius increased to 370px for improved spacing
- **PsychoPhysical Card Enhancements**:
  - Positioned on flat bottom of Stargate layout (110px below circular arrangement)
  - Increased width to w-96 (384px) for better text readability
  - Z-index set to z-0 so it appears behind adjacent cards, preventing overlap
- **UI Layout Improvements**:
  - Moved Select All/Clear All buttons to fixed top-left corner (no longer blocking wheel)
  - Added horizontal padding to wheel container to prevent Draw Settings panel overlap
  - Buttons now have shadow-md for better visibility
  - Fixed Draw button clickability with pointer-events solution (pointer-events-none on container, pointer-events-auto on interactive elements)

### November 2, 2025 - Flyback Journaling Feature
- **Added PostgreSQL Database**: Migrated from in-memory storage to persistent PostgreSQL database for storing drawn tools and journal entries
- **Flyback Modal Component**: Created `FlybackModal` component allowing users to write reflective journal entries for each drawn tool
- **Journal Entry Storage**: Added `journalEntry` TEXT field to `drawn_tools` table for storing user reflections
- **History Panel Enhancement**: Updated history panel to display "Journal" badge with BookOpen icon for tools that have journal entries
- **API Endpoints**:
  - `GET /api/drawn-tools`: Retrieves all drawn tools with journal entries
  - `POST /api/drawn-tools`: Creates new drawn tool records
  - `PATCH /api/drawn-tools/:id/journal`: Updates journal entries for existing draws
- **User Workflow**: Users can now click the "Flyback" button on any drawn tool to open a modal, write reflections, and save them. Journal entries persist across sessions and can be updated at any time by reopening the tool from history.