import { useState, useEffect, useCallback } from 'react';
import * as SpotifyService from '@/services/spotify';
import * as DatabaseService from '@/services/database';
import * as LocationService from '@/services/location';
import * as BackendService from '@/services/backend';
import type {
  SpotifyUser,
  SpotifyAudioFeatures,
  SpotifyCurrentlyPlaying,
  SpotifyTopItems,
  TimeRange,
  CachedTrack,
  ConcertEvent,
  ListeningStats,
} from '@/types';
import type { EchoLocation } from '@/services/location';

export function useSpotifyUser() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SpotifyService.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

export function useNowPlaying() {
  const [np, setNp] = useState<SpotifyCurrentlyPlaying | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SpotifyService.getCurrentlyPlaying();
      setNp(data);
    } catch {
      setNp(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { np, loading, refresh };
}

export function useTopItems<T>(
  fetcher: (timeRange: TimeRange, limit: number) => Promise<SpotifyTopItems<T>>,
  timeRange: TimeRange,
  limit = 50,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetcher(timeRange, limit)
      .then((res) => setItems(res.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [timeRange, limit]);

  return { items, loading };
}

// ── Audio features ─────────────────────────────────────────────

export function useAudioFeatures(trackIds: string[]) {
  const [features, setFeatures] = useState<SpotifyAudioFeatures[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trackIds.length === 0) {
      setFeatures([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    SpotifyService.getAudioFeatures(trackIds)
      .then((res) => setFeatures(res.audio_features.filter(Boolean)))
      .catch(() => setFeatures([]))
      .finally(() => setLoading(false));
  }, [trackIds.join(',')]);

  return { features, loading };
}

export function useLocalHistory(limit = 20) {
  const [tracks, setTracks] = useState<CachedTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getRecentTracks(limit);
      setTracks(data);
    } catch {
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tracks, loading, refresh };
}

export function useConcerts(
  location: EchoLocation | null,
  artistNames: string[],
) {
  const [concerts, setConcerts] = useState<ConcertEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const data = await BackendService.fetchConcerts(location, artistNames, 30);
      setConcerts(data);
    } catch {
      setConcerts([]);
    } finally {
      setLoading(false);
    }
  }, [location, artistNames]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { concerts, loading, refresh };
}

export function useLocation() {
  const [location, setLocation] = useState<EchoLocation | null>(null);
  const [permission, setPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const request = useCallback(async () => {
    setLoading(true);
    const granted = await LocationService.requestLocationPermission();
    setPermission(granted);
    if (granted) {
      const loc = await LocationService.getCurrentLocation();
      setLocation(loc);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const hasPermission = await LocationService.getLocationPermission();
      setPermission(hasPermission);
      if (hasPermission) {
        const loc = await LocationService.getCurrentLocation();
        setLocation(loc);
      }
      setLoading(false);
    })();
  }, []);

  return { location, permission, loading, request };
}

export function useDatabaseStats() {
  const [trackCount, setTrackCount] = useState(0);
  const [dbSize, setDbSize] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [dailyStats, setDailyStats] = useState<ListeningStats[]>([]);

  const refresh = useCallback(async () => {
    const [count, size, ms, stats] = await Promise.all([
      DatabaseService.getTrackCount(),
      DatabaseService.getDatabaseSize(),
      DatabaseService.getTotalListeningMs(),
      DatabaseService.getDailyStats(7),
    ]);
    setTrackCount(count);
    setDbSize(size);
    setTotalMs(ms);
    setDailyStats(stats);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { trackCount, dbSize, totalMs, dailyStats, refresh };
}

export function useInsights() {
  const [topArtist, setTopArtist] = useState<string | null>(null);
  const [mostActiveDay, setMostActiveDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [artist, day] = await Promise.all([
        DatabaseService.getMostPlayedArtist(),
        DatabaseService.getMostActiveDay(),
      ]);
      setTopArtist(artist);
      setMostActiveDay(day);
    } catch (e) {
      console.log('[Insights] error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { topArtist, mostActiveDay, loading, refresh };
}
