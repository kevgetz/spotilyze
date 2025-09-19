export interface SpotifyStreamingRecord {
  ts: string;                                    // Timestamp in ISO format
  platform: string;                             // Platform (ios, android, etc.)
  ms_played: number;                             // Milliseconds played
  conn_country: string;                          // Connection country code
  ip_addr: string;                               // IP address
  master_metadata_track_name: string | null;    // Track name (null for podcasts)
  master_metadata_album_artist_name: string | null; // Artist name (null for podcasts)
  master_metadata_album_album_name: string | null;  // Album name (null for podcasts)
  spotify_track_uri: string | null;             // Track URI (null for podcasts)
  episode_name: string | null;                  // Podcast episode name
  episode_show_name: string | null;             // Podcast show name
  spotify_episode_uri: string | null;           // Episode URI
  audiobook_title: string | null;               // Audiobook title
  audiobook_uri: string | null;                 // Audiobook URI
  audiobook_chapter_uri: string | null;         // Audiobook chapter URI
  audiobook_chapter_title: string | null;       // Audiobook chapter title
  reason_start: string;                         // Why playback started
  reason_end: string;                           // Why playback ended
  shuffle: boolean;                             // Shuffle mode
  skipped: boolean;                             // Was skipped
  offline: boolean;                             // Offline playback
  ooffline_timestamp: number | null;            // Offline timestamp
  incognito_mode: boolean;                      // Incognito mode
}