import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { Accent, Spacing } from '@/constants/theme';
import { StatGrid } from '@/components/StatGrid';
import {
  useTopItems,
  useDatabaseStats,
} from '@/hooks/useData';
import { getTopTracks, getTopArtists } from '@/services/spotify';
import { TIME_RANGE_MAP } from '@/types';
import type {
  SpotifyTrack,
  SpotifyArtist,
  TimeRangeLabel,
  DataScope,
} from '@/types';
import styles from '@/styles/stats';

const TIME_RANGES: TimeRangeLabel[] = ['7 Days', '30 Days', '6 Months'];
const DATA_SCOPES: DataScope[] = ['tracks', 'artists', 'albums'];

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRangeLabel>('30 Days');
  const [scope, setScope] = useState<DataScope>('tracks');
  const gridRef = useRef<ViewShot>(null);

  const spotifyRange = TIME_RANGE_MAP[timeRange];

  const { items: topTracks, loading: tracksLoading } = useTopItems<SpotifyTrack>(
    getTopTracks,
    spotifyRange,
    50,
  );

  const { items: topArtists, loading: artistsLoading } = useTopItems<SpotifyArtist>(
    getTopArtists,
    spotifyRange,
    50,
  );

  const { totalMs, trackCount } = useDatabaseStats();

  const displayItems = scope === 'tracks' ? topTracks : topArtists;
  const loading = scope === 'tracks' ? tracksLoading : artistsLoading;
  const totalHours = (totalMs / 3600000).toFixed(1);
  const avgDaily = trackCount > 0 ? (trackCount / 7).toFixed(0) : '0';

  const handleExport = async () => {
    if (!gridRef.current?.capture) return;
    try {
      const uri = await gridRef.current.capture();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your top chart',
      });
    } catch {
      Alert.alert('Export failed', 'Could not capture the grid.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Your Stats</Text>

      <View style={styles.chipRow}>
        {TIME_RANGES.map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.chip, timeRange === range && styles.chipActive]}
            onPress={() => setTimeRange(range)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, timeRange === range && styles.chipTextActive]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chipRow}>
        {DATA_SCOPES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.scopeChip, scope === s && styles.scopeChipActive]}
            onPress={() => setScope(s)}
            activeOpacity={0.7}
          >
            <Text style={[styles.scopeText, scope === s && styles.scopeTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickFacts}>
        <Text style={styles.sectionTitle}>Quick Facts</Text>
        <View style={styles.factsRow}>
          <View style={styles.factCard}>
            <Text style={styles.factValue}>{totalHours}h</Text>
            <Text style={styles.factLabel}>Listening Time</Text>
          </View>
          <View style={styles.factCard}>
            <Text style={styles.factValue}>{trackCount}</Text>
            <Text style={styles.factLabel}>Total Plays</Text>
          </View>
          <View style={styles.factCard}>
            <Text style={styles.factValue}>{avgDaily}</Text>
            <Text style={styles.factLabel}>Avg / Day</Text>
          </View>
        </View>
      </View>

      <View style={styles.gridSection}>
        <View style={styles.gridHeader}>
          <Text style={styles.sectionTitle}>
            Top {scope === 'tracks' ? 'Tracks' : scope === 'artists' ? 'Artists' : 'Albums'}
          </Text>
          <TouchableOpacity onPress={handleExport} style={styles.exportBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color={Accent.primary} />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Accent.primary} style={{ marginVertical: Spacing.xxl }} />
        ) : (
          <ViewShot ref={gridRef} options={{ format: 'png', quality: 1 }}>
            <StatGrid items={displayItems} type={scope === 'artists' ? 'artist' : 'track'} />
          </ViewShot>
        )}
      </View>
    </ScrollView>
  );
}
