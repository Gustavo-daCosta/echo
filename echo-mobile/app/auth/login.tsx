/**
 * LoginScreen — Spotify OAuth gateway with branded connect button.
 */
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accent, Neutral } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/login';

export default function LoginScreen() {
  const { promptAsync, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons name="pulse" size={48} color={Accent.primary} />
        </View>
        <Text style={styles.appName}>echo</Text>
        <Text style={styles.tagline}>
          Your music. Your stats.{'\n'}Your local scene.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          activeOpacity={0.9}
          onPress={promptAsync}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Neutral.textInverse} />
          ) : (
            <>
              <Ionicons name="musical-notes" size={22} color={Neutral.textInverse} />
              <Text style={styles.buttonText}>Connect with Spotify</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          We never store your Spotify password.{'\n'}
          Your data stays on-device.
        </Text>
      </View>
    </View>
  );
}
