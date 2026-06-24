export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; height: number; width: number }[];
  product: 'premium' | 'free' | 'open';
  country: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  release_date: string;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
  preview_url: string | null;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo: number;
  key: number;
  mode: number;
  duration_ms: number;
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number | null;
  timestamp: number;
}

export interface SpotifyTopItems<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
export type TimeRangeLabel = '7 Days' | '30 Days' | '6 Months';

export const TIME_RANGE_MAP: Record<TimeRangeLabel, TimeRange> = {
  '7 Days': 'short_term',
  '30 Days': 'medium_term',
  '6 Months': 'long_term',
};

export interface ConcertEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  imageUrl: string | null;
  url: string;
  distanceKm: number;
  matchedArtists: string[];
}

export interface CachedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt: string;
  durationMs: number;
}

export interface ListeningStats {
  date: string;
  totalPlays: number;
  totalMs: number;
  uniqueArtists: number;
  uniqueTracks: number;
}

export type DataScope = 'tracks' | 'artists' | 'albums';

export const DATA_SCOPE_LABELS: DataScope[] = ['tracks', 'artists', 'albums'];
