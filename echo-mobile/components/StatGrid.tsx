import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { SpotifyTrack, SpotifyArtist } from '@/types';
import styles from '@/styles/stat-grid';

interface Props {
  items: (SpotifyTrack | SpotifyArtist)[];
  type: 'track' | 'artist';
}

function getImage(item: SpotifyTrack | SpotifyArtist): string | undefined {
  if ('album' in item) {
    return item.album?.images?.[0]?.url;
  }
  return item.images?.[0]?.url;
}

function getSubtitle(item: SpotifyTrack | SpotifyArtist): string {
  if ('album' in item) {
    return item.artists?.map((a) => a.name).join(', ') ?? '';
  }
  return '';
}

export function StatGrid({ items, type }: Props) {
  const display = items.slice(0, 9);

  return (
    <View style={styles.grid}>
      {display.map((item, i) => {
        const imageUrl = getImage(item);
        return (
          <TouchableOpacity key={item.id} style={styles.cell} activeOpacity={0.7}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.image, type === 'artist' && styles.imageRound]}
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder, type === 'artist' && styles.imageRound]} />
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{i + 1}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {type === 'track' && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {getSubtitle(item)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}

      {Array.from({ length: Math.max(0, 9 - display.length) }).map((_, i) => (
        <View key={`empty-${i}`} style={styles.cell} />
      ))}
    </View>
  );
}
