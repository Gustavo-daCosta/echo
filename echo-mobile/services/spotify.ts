import * as SecureStore from 'expo-secure-store';
import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyCurrentlyPlaying,
  SpotifyTopItems,
  TimeRange,
} from '@/types';

const SPOTIFY_API = 'https://api.spotify.com/v1';
const TOKEN_KEY = 'spotify_access_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRY_KEY = 'spotify_token_expiry';

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const expiry = Date.now() + expiresIn * 1000;
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  await SecureStore.setItemAsync(EXPIRY_KEY, String(expiry));
}

export async function getAccessToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) return null;

  const expiryStr = await SecureStore.getItemAsync(EXPIRY_KEY);
  if (expiryStr && Date.now() > Number(expiryStr)) {
    return null;
  }
  return token;
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(EXPIRY_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}

async function spotifyFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${SPOTIFY_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    await clearTokens();
    throw new Error('Token expired');
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${err}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export async function getCurrentUser(): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>('/me');
}

export async function getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
  try {
    return await spotifyFetch<SpotifyCurrentlyPlaying>(
      '/me/player/currently-playing',
    );
  } catch {
    return null;
  }
}

export async function getRecentlyPlayed(
  limit = 20,
): Promise<{ items: { track: SpotifyTrack; played_at: string }[] }> {
  return spotifyFetch(
    `/me/player/recently-played?limit=${limit}`,
  );
}

export async function getTopTracks(
  timeRange: TimeRange = 'medium_term',
  limit = 50,
): Promise<SpotifyTopItems<SpotifyTrack>> {
  return spotifyFetch(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
  );
}

export async function getTopArtists(
  timeRange: TimeRange = 'medium_term',
  limit = 50,
): Promise<SpotifyTopItems<SpotifyArtist>> {
  return spotifyFetch(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
  );
}

export async function getAudioFeatures(
  trackIds: string[],
): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
  const ids = trackIds.join(',');
  return spotifyFetch(`/audio-features?ids=${ids}`);
}

export async function getAudioFeaturesForTrack(
  trackId: string,
): Promise<SpotifyAudioFeatures> {
  return spotifyFetch(`/audio-features/${trackId}`);
}

export async function getArtistTopTracks(
  artistId: string,
): Promise<{ tracks: SpotifyTrack[] }> {
  return spotifyFetch(
    `/artists/${artistId}/top-tracks?market=from_token`,
  );
}

export async function searchTracks(
  query: string,
  limit = 10,
): Promise<{ tracks: SpotifyTopItems<SpotifyTrack> }> {
  return spotifyFetch(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
  );
}
