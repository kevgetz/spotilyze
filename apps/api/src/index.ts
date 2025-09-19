import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import JSZip from 'jszip';
import { SpotifyDataArraySchema } from 'shared';
import { MongoClient, Db } from 'mongodb';

// MongoDB connection
let db: Db;
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/spotilyze');

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('spotilyze');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Connect to database on startup
connectToDatabase();

// Collection interfaces
interface User {
  _id?: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

interface StreamingUpload {
  _id?: string;
  userId: string;
  filename: string;
  uploadedAt: Date;
  recordCount: number;
  fileSize: number;
}

interface StreamingRecord {
  _id?: string;
  userId: string;
  uploadId: string;
  ts: string;
  ms_played: number;
  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name?: string;
  spotify_track_uri?: string;
}

const app = new Hono();

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:5173',
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
      const validationResult = SpotifyDataArraySchema.safeParse(jsonData);
      if (!validationResult.success) {
        return c.json({
          success: false,
          message: `Invalid Spotify streaming history format in file: ${jsonFileName}. ${validationResult.error.message}`
        }, 400);
      }

      const filteredData = jsonData.filter((record: any) => {
        // Must be music (not podcast/audiobook)
        if (!record.master_metadata_track_name || !record.master_metadata_album_artist_name) {
          return false;
        }
        
        // Must meet minimum stream duration (28 seconds = 28,000 ms)
        if (!record.ms_played || record.ms_played < 28000) {
          return false;
        }
        
        return true;
      });

      // Add this data to streaming records
      if (Array.isArray(filteredData)) {
        streamingRecords.push(...filteredData);
      }
    }

    // Store in database
    const uploadRecord = {
      userId: 'temp-user',
      filename: zippedFile.name,
      uploadedAt: new Date(),
      recordCount: streamingRecords.length,
      fileSize: zippedFile.size
    };

    const uploadResult = await db.collection('uploads').insertOne(uploadRecord);
    const uploadId = uploadResult.insertedId.toString();

    // Store streaming records with reference to upload
    const recordsToInsert = streamingRecords.map(record => ({
      ...record,
      userId: 'temp-user',
      uploadId: uploadId
    }));

    await db.collection('streaming_records').insertMany(recordsToInsert);

  return c.json({ 
    success: true, 
    message: `Successfully stored ${streamingRecords.length} quality music streams in database`,
    totalFiles: jsonFiles.length,
    qualityStreams: streamingRecords.length,
    uploadId: uploadId
  });
    }
    catch (error) {
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