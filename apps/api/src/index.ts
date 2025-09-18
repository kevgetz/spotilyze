import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { success } from 'zod';
import JSZip from 'jszip';
import { validateSpotifyDataArray } from 'shared';

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
    const body = await c.req.parseBody();
    const zippedFile = body['file'] as File;

    if (!zippedFile) {
      return c.json({
        success: false,
        message: 'File does not exist'
      }, 400)
    }

    if (zippedFile.size > 250*1024*1024) {
      return c.json({
        success: false,
        message: 'File is bigger than 250MB'
      }, 400)
    }

    if (!zippedFile.name.toLowerCase().endsWith('.zip')) {
      return c.json({
        success: false,
        message: 'Uploaded File is not a .zip File'
      }, 400)
    }
    
    const zippedFileBuffer = await zippedFile.arrayBuffer();
    const loadedZipFile = await JSZip.loadAsync(zippedFileBuffer);

    const jsonFiles: string[] = [];
    const streamingRecords = [];

    // Iterate through all files in the ZIP
    loadedZipFile.forEach((relativePath, zipEntry) => {
      console.log(relativePath);
      // Only process JSON files, ignore PDFs and other files
      if (relativePath.toLowerCase().endsWith('.json') && 
          !zipEntry.dir && 
          relativePath.toLowerCase().includes('audio')) {
        jsonFiles.push(relativePath);
      }
    });

    // Check if we found any JSON files
    if (jsonFiles.length === 0) {
      return c.json({
        success: false,
        message: 'No JSON files found in the ZIP archive'
      }, 400);
    }

    // Process each JSON file
    for (const jsonFileName of jsonFiles) {
      const zipEntry = loadedZipFile.file(jsonFileName);
      if (!zipEntry) continue;

      // Extract file content as text
      const jsonContent = await zipEntry.async('text');
      
      // Parse JSON content
      let jsonData;
      try {
        jsonData = JSON.parse(jsonContent);
      } catch (error) {
        return c.json({
          success: false,
          message: `Invalid JSON format in file: ${jsonFileName}`
        }, 400);
      }

      // Validate JSON Content
      if (!validateSpotifyDataArray(jsonData)) {
        return c.json({
          success: false,
          message: `Invalid Spotify streaming history format in file: ${jsonFileName}`
        }, 400);
      }

      // Add this data to our streaming records
      if (Array.isArray(jsonData)) {
        streamingRecords.push(...jsonData);
      }
    }

    return c.json({ 
      success: true, 
      message: `Successfully processed ${jsonFiles.length} JSON files with ${streamingRecords.length} total records`
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