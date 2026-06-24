import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import type { ConcertEvent } from '@/types';
import styles from '@/styles/concert-card';

interface Props {
  concert: ConcertEvent;
}

export function ConcertCard({ concert }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => Linking.openURL(concert.url)}
    >
      <View style={styles.top}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date(concert.date).getDate()}
          </Text>
          <Text style={styles.dateMonth}>
            {new Date(concert.date).toLocaleDateString('en-US', { month: 'short' })}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {concert.name}
          </Text>
          <Text style={styles.venue}>
            📍 {concert.venue} · {concert.city}
          </Text>
          <Text style={styles.distance}>
            {concert.distanceKm.toFixed(0)} km away
          </Text>
        </View>

        {concert.imageUrl ? (
          <Image source={{ uri: concert.imageUrl }} style={styles.eventImage} />
        ) : null}
      </View>

      {concert.matchedArtists.length > 0 && (
        <View style={styles.matches}>
          {concert.matchedArtists.map((artist) => (
            <View key={artist} style={styles.matchTag}>
              <Text style={styles.matchIcon}>🎵</Text>
              <Text style={styles.matchText}>
                {artist} in your top artists
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
