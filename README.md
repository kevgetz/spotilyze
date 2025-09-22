# Spotilyze
  Stack Developers

  🏗️ Project Architecture

  Spotilyze is a monorepo built with pnpm workspaces that
  analyzes Spotify streaming history data. It follows a
  modern full-stack architecture:

  spotilyze/
  ├── apps/
  │   ├── api/          # Backend API (Node.js + Hono)
  │   └── web/          # Frontend SPA (React + Vite)
  ├── packages/
  │   └── shared/       # Shared validation schemas
  └── package.json      # Workspace configuration

  🔧 Technology Stack

  Backend (apps/api/)

  - Framework: https://hono.dev - Fast web framework for
  Node.js
  - Database: MongoDB with native driver
  - Authentication: JWT tokens + bcrypt password hashing
  - Runtime: Node.js with tsx for development
  - File Processing: JSZip for handling Spotify data
  exports
  - Entry Point: apps/api/src/index.ts:683

  Frontend (apps/web/)

  - Framework: React 18 with TypeScript
  - Routing: https://tanstack.com/router - Type-safe
  routing
  - Styling: TailwindCSS + Radix UI components
  - Charts: Recharts for data visualization
  - Forms: React Hook Form + Zod validation
  - Build Tool: Vite
  - Entry Point: apps/web/src/main.tsx:21

  Shared Code (packages/shared/)

  - Validation: Zod schemas for Spotify data format
  - Location: packages/shared/src/validation.ts:32

  🚀 Getting Started

  Development Commands

  # Install dependencies
  pnpm install

  # Start both frontend and backend
  pnpm dev

  # Start individual services
  pnpm dev:api    # Backend only
  pnpm dev:web    # Frontend only

  # Build production
  pnpm build

  Environment Setup

  Create .env files:
  - Backend: Set MONGODB_URI and JWT_SECRET
  - Frontend: API runs on http://localhost:3000

  📊 Core Features & Where to Find Them

  1. User Authentication

  - Registration: apps/api/src/index.ts:579
  - Login: apps/api/src/index.ts:632
  - Frontend Context: apps/web/src/contexts/AuthContext
  - Auth Routes: apps/web/src/routes/auth/

  2. File Upload System

  - Backend Upload: apps/api/src/index.ts:91 - Processes
  Spotify ZIP files
  - Frontend Upload: apps/web/src/routes/upload.tsx
  - Data Filtering: Only music tracks >28 seconds
  (apps/api/src/index.ts:170)
  - File Validation: Uses shared Zod schemas

  3. Statistics Dashboard

  All stats endpoints use MongoDB aggregation pipelines:
  - Summary Stats: apps/api/src/index.ts:397 - Total
  tracks, listening time, unique artists
  - Top Artists: apps/api/src/index.ts:256 - By total play
  time
  - Top Albums: apps/api/src/index.ts:297 - By total play
  time
  - Top Songs: apps/api/src/index.ts:347 - By total play
  time
  - Monthly Activity: apps/api/src/index.ts:449 - Time
  series data
  - Daily Patterns: apps/api/src/index.ts:498 - Hour/day of
   week analysis
  - Artist Distribution: apps/api/src/index.ts:542 - Top 8
  artists for charts

  Frontend charts in: apps/web/src/components/stats/

  4. Data Management

  - Delete User Data: apps/api/src/index.ts:229 - Removes
  all user's streaming records
  - Database Collections: users, uploads, streaming_records

  🗃️ Database Schema

  Collections (MongoDB)

  // Users (apps/api/src/index.ts:48)
  interface User {
    _id?: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
  }

  // Upload Records (apps/api/src/index.ts:55)
  interface StreamingUpload {
    _id?: string;
    userId: string;
    filename: string;
    uploadedAt: Date;
    recordCount: number;
    fileSize: number;
  }

  // Individual Streaming Records 
  (apps/api/src/index.ts:64)
  interface StreamingRecord {
    _id?: string;
    userId: string;
    uploadId: string;
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    // ... other Spotify fields
  }

  🛡️ Security Features

  - JWT Authentication: 7-day token expiration
  - Password Hashing: bcrypt with 12 salt rounds
  - User Data Isolation: All queries filtered by userId
  - CORS: Configured for frontend origin
  - File Size Limits: 250MB max upload size

  🎯 Development Guidelines

  Adding New Features

  1. API Endpoints: Add to apps/api/src/index.ts (consider
  splitting into separate files)
  2. Frontend Routes: Add to apps/web/src/routes/
  3. Shared Types: Add to packages/shared/src/validation.ts
  4. Components: Add to apps/web/src/components/

  Code Quality

  - Linting: pnpm lint (Biome + ESLint)
  - Type Checking: pnpm type-check
  - Formatting: pnpm format

  Key Patterns

  - Authentication Middleware: verifyToken function
  protects all user endpoints
  - Error Handling: Consistent JSON error responses
  - Data Validation: Zod schemas for type safety
  - MongoDB Aggregations: Complex analytics queries

⏺ The application is well-structured for learning
  full-stack development. Start by exploring the upload
  flow (/upload route) and then examine how the uploaded
  data flows through the stats dashboard (/stats route).
  The codebase demonstrates modern patterns like type-safe
  routing, form validation, and data visualization.