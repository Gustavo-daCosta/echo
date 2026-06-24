import { View, Text, Image } from 'react-native';
import type { SpotifyTrack, CachedTrack } from '@/types';
import styles from '@/styles/track-item';

interface Props {
  track: SpotifyTrack | CachedTrack;
  rank?: number;
}

function isSpotifyTrack(
  track: SpotifyTrack | CachedTrack,
): track is SpotifyTrack {
  return 'album' in track && typeof track.album === 'object';
}

export function TrackItem({ track, rank }: Props) {
  const albumArt = isSpotifyTrack(track)
    ? track.album.images?.[0]?.url
    : track.albumArt;
  const artist = isSpotifyTrack(track)
    ? track.artists.map((a) => a.name).join(', ')
    : track.artist;
  const name = track.name;

  return (
    <View style={styles.row}>
      {rank !== undefined && (
        <Text style={styles.rank}>{rank}</Text>
      )}
      <Image
        source={{ uri: albumArt || undefined }}
        style={styles.art}
      />
      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>
    </View>
  );
}
