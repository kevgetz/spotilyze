# Spotilyze - Local Setup Guide

A web app for analyzing your Spotify streaming history with detailed insights and visualizations.

## Prerequisites

- **Node.js** (v18+)
- **pnpm** 
- **MongoDB** (local installation or Atlas)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/kevgetz/spotilyze.git
cd spotilyze
pnpm install
```

### 2. Set Up MongoDB

**Option A - Local MongoDB:**
```bash
# Install MongoDB locally, then start it
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod                         # Linux
```

**Option B - MongoDB Atlas:**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string

### 3. Configure Environment

Create `apps/api/.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/spotilyze
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

For MongoDB Atlas, use:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotilyze
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

Or start separately:
```bash
# Terminal 1 - Backend
pnpm dev:api

# Terminal 2 - Frontend  
pnpm dev:web
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Using the App

1. **Create Account** - Sign up at the login page
2. **Get Spotify Data** - Request your extended streaming history from [Spotify Privacy Settings](https://www.spotify.com/privacy)
3. **Upload Data** - Upload the ZIP file you receive from Spotify
4. **View Analytics** - Explore your music statistics and charts

## Project Structure

```
spotilyze/
├── apps/
│   ├── api/          # Backend (Hono + MongoDB)
│   └── web/          # Frontend (React + TypeScript)
├── packages/
│   └── shared/       # Shared validation schemas
└── package.json      # Workspace root
```

## Troubleshooting

**MongoDB connection issues:** Ensure MongoDB is running and connection string is correct

**Port conflicts:** Change port in `apps/api/.env` or kill conflicting process

**File upload fails:** Ensure Spotify ZIP file is under 250MB and contains streaming history

---

**Note:** You need to request your Spotify data through Spotify's official privacy settings. The app processes your personal data file locally.