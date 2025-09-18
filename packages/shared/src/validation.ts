import { z } from 'zod';

export const SpotifyStreamingRecordSchema = z.object({
  ts: z.string(),
  platform: z.string(),
  ms_played: z.number(),
  conn_country: z.string(),
  ip_addr: z.string(),
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
  reason_start: z.string(),
  reason_end: z.string(),
  shuffle: z.boolean(),
  skipped: z.boolean(),
  offline: z.boolean(),
  offline_timestamp: z.number(),
  incognito_mode: z.boolean(),
});

export const SpotifyDataArraySchema = z.array(SpotifyStreamingRecordSchema);

// Export inferred types
export type SpotifyStreamingRecord = z.infer<typeof SpotifyStreamingRecordSchema>;