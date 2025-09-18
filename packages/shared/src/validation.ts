import { type SpotifyStreamingRecord } from './types.js';

export function validateSpotifyRecord(record: any): record is SpotifyStreamingRecord {
  // Überprüfe die essentiellen Felder
  const requiredFields = ['ts', 'ms_played', 'platform'];
  
  for (const field of requiredFields) {
    if (!(field in record)) {
      return false;
    }
  }

  // Für Musik-Tracks sollten diese Felder existieren (können aber null sein)
  const musicFields = ['master_metadata_track_name', 'master_metadata_album_artist_name'];
  const hasAnyMusicField = musicFields.some(field => field in record);
  
  // Für Podcasts sollten diese Felder existieren (können aber null sein)
  const podcastFields = ['episode_name', 'episode_show_name'];
  const hasAnyPodcastField = podcastFields.some(field => field in record);
  
  // Muss entweder Musik oder Podcast Felder haben
  return hasAnyMusicField || hasAnyPodcastField;
}

export function validateSpotifyDataArray(data: any[]): boolean {
  if (data.length === 0) return true; // Leere Arrays sind ok
  
  // Validiere die ersten 5 Records als Stichprobe
  const sampleSize = Math.min(5, data.length);
  for (let i = 0; i < sampleSize; i++) {
    if (!validateSpotifyRecord(data[i])) {
      return false;
    }
  }
  
  return true;
}