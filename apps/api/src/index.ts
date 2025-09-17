import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:5173', // Vite default port
  allowHeaders: ['Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'Spotilyze API is running' });
});

// Upload endpoint (Feature 1)
app.post('/upload', async (c) => {
  try {
    // For now, just return a success message
    // We'll implement file handling in the next step
    return c.json({ 
      success: true, 
      message: 'Upload endpoint is ready' 
    });
  } catch (error) {
    return c.json({ 
      success: false, 
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

const port = 3000;
console.log(`🚀 Spotilyze API Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});