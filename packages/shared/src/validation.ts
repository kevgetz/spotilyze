import { z } from 'zod';

export const SpotifyStreamingRecordSchema = z.object({
  // Required core fields
  ts: z.string(),
  ms_played: z.number(),
  
  // Optional fields
  platform: z.string().nullable(),
  conn_country: z.string().nullable(),
  ip_addr: z.string().nullable(),
  master_metadata_track_name: z.string().nullable(),
  master_metadata_album_artist_name: z.string().nullable(),
  master_metadata_album_album_name: z.string().nullable(),
  spotify_track_uri: z.string().nullable(),
  episode_name: z.string().nullable(),
  episode_show_name: z.string().nullable(),
  spotify_episode_uri: z.string().nullable(),
  audiobook_title: z.string().nullable(),
  audiobook_uri: z.string().nullable(),
  audiobook_chapter_uri: z.string().nullable(),
  audiobook_chapter_title: z.string().nullable(),
  reason_start: z.string().nullable(),
  reason_end: z.string().nullable(),
  shuffle: z.boolean().nullable(),
  skipped: z.boolean().nullable(),
  offline: z.boolean().nullable(),
  offline_timestamp: z.number().nullable(),
  incognito_mode: z.boolean().nullable(),
});

export const SpotifyDataArraySchema = z.array(SpotifyStreamingRecordSchema);

// Export inferred types
export type SpotifyStreamingRecord = z.infer<typeof SpotifyStreamingRecordSchema>;