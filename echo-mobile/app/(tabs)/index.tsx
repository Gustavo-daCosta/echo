import { View, Text, ScrollView, Image } from 'react-native';
import { NowPlayingCard } from '@/components/NowPlayingCard';
import { TrackItem } from '@/components/TrackItem';
import {
  useSpotifyUser,
  useNowPlaying,
  useLocalHistory,
  useInsights,
} from '@/hooks/useData';
import { useEffect, useCallback } from 'react';
import * as SpotifyService from '@/services/spotify';
import * as Database from '@/services/database';
import styles from '@/styles/home';

export default function HomeScreen() {
  const { user } = useSpotifyUser();
  const { np, loading: npLoading } = useNowPlaying();
  const { tracks: recentTracks, refresh: refreshHistory } = useLocalHistory(3);
  const { topArtist, mostActiveDay, loading: insightsLoading, refresh: refreshInsights } = useInsights();

  const syncHistory = useCallback(async () => {
    try {
      const recent = await SpotifyService.getRecentlyPlayed(20);
      const cached = recent.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(', '),
        album: item.track.album.name,
        albumArt: item.track.album.images[0]?.url ?? '',
        playedAt: item.played_at,
        durationMs: item.track.duration_ms,
      }));
      if (cached.length > 0) {
        await Database.saveTracks(cached);
        const today = new Date().toISOString().split('T')[0];
        const uniqueArtists = new Set(cached.map((t) => t.artist)).size;
        const uniqueTracks = new Set(cached.map((t) => t.id)).size;
        const totalMs = cached.reduce((s, t) => s + t.durationMs, 0);
        await Database.updateDailyStats(today, cached.length, totalMs, uniqueArtists, uniqueTracks);
        refreshHistory();
        refreshInsights();
      }
    } catch (e) {
      console.log('[Home] Sync error:', e);
    }
  }, [refreshHistory, refreshInsights]);

  useEffect(() => {
    syncHistory();
  }, [syncHistory]);

  const profilePic = user?.images?.[0]?.url;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetingText}>Good {getTimeOfDay()},</Text>
          <Text style={styles.userName}>{user?.display_name ?? 'Listener'}</Text>
        </View>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : null}
      </View>

      <View style={styles.section}>
        <NowPlayingCard data={np} loading={npLoading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Quick Insight</Text>
        <View style={styles.insightCard}>
          {topArtist ? (
            <>
              <Text style={styles.insightIcon}>🎧</Text>
              <Text style={styles.insightText}>
                Your top artist right now is{' '}
                <Text style={styles.insightBold}>{topArtist}</Text>
              </Text>
              {mostActiveDay && (
                <Text style={styles.insightSub}>
                  Your most active listening day was{' '}
                  {new Date(mostActiveDay).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.insightIcon}>🎵</Text>
              <Text style={styles.insightText}>
                Start listening on Spotify to unlock personalized insights!
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Recent Tracks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <View style={styles.recentList}>
          {recentTracks.length > 0 ? (
            recentTracks.map((track, i) => (
              <TrackItem key={track.playedAt + track.id} track={track} />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No recent tracks yet — start playing on Spotify!
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
