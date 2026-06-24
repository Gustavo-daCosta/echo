import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accent, Neutral } from '@/constants/theme';
import { ConcertCard } from '@/components/ConcertCard';
import { useLocation, useConcerts } from '@/hooks/useData';
import styles from '@/styles/radar';

export default function LiveRadarScreen() {
  const { location, permission, loading: locLoading, request: requestLoc } = useLocation();
  const { concerts, loading: concertsLoading, refresh: refreshConcerts } = useConcerts(
    location,
    [],
  );

  const hasPermission = permission;
  const needsLocation = !hasPermission && !locLoading;
  const hasNoResults = hasPermission && location && concerts.length === 0 && !concertsLoading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Live Radar</Text>

      {locLoading ? (
        <View style={styles.locationBanner}>
          <ActivityIndicator color={Neutral.textTertiary} size="small" />
          <Text style={styles.locationText}>Detecting location...</Text>
        </View>
      ) : hasPermission && location ? (
        <View style={styles.locationBannerActive}>
          <View style={styles.locationDot} />
          <Text style={styles.locationTextActive}>
            {location.city ?? 'Unknown'}, {location.country ?? ''}
          </Text>
          <TouchableOpacity onPress={refreshConcerts} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={16} color={Accent.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.locationPrompt} onPress={requestLoc} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={20} color={Accent.primary} />
          <Text style={styles.locationPromptText}>
            Enable location to find concerts near you
          </Text>
        </TouchableOpacity>
      )}

      {concertsLoading && location ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={Accent.primary} size="large" />
          <Text style={styles.loadingText}>Searching for concerts...</Text>
        </View>
      ) : needsLocation ? (
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={48} color={Neutral.textTertiary} />
          <Text style={styles.emptyTitle}>Location Required</Text>
          <Text style={styles.emptyDesc}>
            Enable location access to discover concerts near you.
          </Text>
        </View>
      ) : hasNoResults ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={48} color={Neutral.textTertiary} />
          <Text style={styles.emptyTitle}>No Concerts Found</Text>
          <Text style={styles.emptyDesc}>
            No upcoming shows in your area right now. Check back soon!
          </Text>
        </View>
      ) : (
        <View style={styles.feed}>
          <Text style={styles.feedCount}>
            {concerts.length} concert{concerts.length !== 1 ? 's' : ''} nearby
          </Text>
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
