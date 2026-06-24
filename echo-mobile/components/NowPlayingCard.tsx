import { View, Text, Animated, Image as RNImage } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import type { SpotifyCurrentlyPlaying, SpotifyTrack } from '@/types';
import * as SpotifyService from '@/services/spotify';
import styles from '@/styles/now-playing-card';

interface Props {
  data: SpotifyCurrentlyPlaying | null;
  loading: boolean;
}

export function NowPlayingCard({ data, loading }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [lastTrack, setLastTrack] = useState<SpotifyTrack | null>(null);

  // Fetch last played track as fallback when nothing is playing
  useEffect(() => {
    if (!data?.is_playing && !loading) {
      SpotifyService.getRecentlyPlayed(1).then((recent) => {
        if (recent.items.length > 0) {
          setLastTrack(recent.items[0].track);
        }
      }).catch(() => {});
    }
  }, [data?.is_playing, loading]);

  useEffect(() => {
    if (data?.is_playing) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
    pulseAnim.setValue(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.is_playing]);

  const track = data?.item ?? lastTrack;
  const albumArt = track?.album?.images?.[0]?.url;
  const artistName = track?.artists?.map((a) => a.name).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {data?.is_playing ? 'Now Playing' : 'Last Played'}
        </Text>
        {data?.is_playing && (
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
        )}
      </View>

      {loading ? (
        <View style={styles.skeleton}>
          <View style={styles.skeletonArt} />
          <View style={styles.skeletonText}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '60%' }]} />
          </View>
        </View>
      ) : track ? (
        <View style={styles.trackInfo}>
          {albumArt ? (
            <RNImage
              source={{ uri: albumArt }}
              style={styles.albumArt}
            />
          ) : (
            <View style={[styles.albumArt, styles.albumArtPlaceholder]} />
          )}
          <View style={styles.trackMeta}>
            <Text style={styles.trackName} numberOfLines={1}>
              {track.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {artistName}
            </Text>
            <Text style={styles.albumName} numberOfLines={1}>
              {'album' in track ? track.album.name : ''}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nothing played yet</Text>
          <Text style={styles.emptySub}>Play something on Spotify</Text>
        </View>
      )}
    </View>
  );
}
