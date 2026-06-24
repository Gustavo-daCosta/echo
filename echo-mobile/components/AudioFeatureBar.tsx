import { View, Text } from 'react-native';
import styles from '@/styles/audio-feature-bar';

interface Props {
  label: string;
  value: number;
  color: string;
}

export function AudioFeatureBar({ label, value, color }: Props) {
  const pct = Math.min(Math.max(value, 0), 1);
  const displayPct = Math.round(pct * 100);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${displayPct}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.value}>{displayPct}%</Text>
    </View>
  );
}
