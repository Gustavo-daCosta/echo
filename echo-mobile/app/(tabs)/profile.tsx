import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Neutral, Accent } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useSpotifyUser, useDatabaseStats } from '@/hooks/useData';
import { clearAll } from '@/services/database';
import styles from '@/styles/profile';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { user } = useSpotifyUser();
  const { trackCount, dbSize, totalMs, refresh: refreshDb } = useDatabaseStats();

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const profilePic = user?.images?.[0]?.url;
  const totalHours = (totalMs / 3600000).toFixed(1);
  const dbSizeMB = (dbSize / 1024 / 1024).toFixed(2);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Listening History',
      'This will remove all locally cached listening data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => { await clearAll(); refreshDb(); },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to disconnect Spotify?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Profile</Text>

      <View style={styles.identityCard}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color={Neutral.textTertiary} />
          </View>
        )}
        <View style={styles.identityMeta}>
          <Text style={styles.displayName}>{user?.display_name ?? 'Unknown User'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          {user?.product && (
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>
                {user.product === 'premium' ? '🔷 Premium' : 'Free'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Local Database Cache Monitor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local Database Cache</Text>
        <View style={styles.cacheCard}>
          <View style={styles.cacheRow}>
            <View style={styles.cacheItem}>
              <Text style={styles.cacheValue}>{trackCount}</Text>
              <Text style={styles.cacheLabel}>Tracks Cached</Text>
            </View>
            <View style={styles.cacheItem}>
              <Text style={styles.cacheValue}>{totalHours}h</Text>
              <Text style={styles.cacheLabel}>Total Listening</Text>
            </View>
            <View style={styles.cacheItem}>
              <Text style={styles.cacheValue}>{dbSizeMB} MB</Text>
              <Text style={styles.cacheLabel}>Storage Used</Text>
            </View>
          </View>
          <View style={styles.storageBar}>
            <View style={styles.storageBarTrack}>
              <View
                style={[
                  styles.storageBarFill,
                  { width: `${Math.min(Number(dbSizeMB) * 10, 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="location-outline" size={20} color={Neutral.text} />
              <Text style={styles.settingLabel}>Background Location</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: Neutral.border, true: Accent.primaryLight }}
              thumbColor={locationEnabled ? Accent.primary : Neutral.textTertiary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color={Neutral.text} />
              <Text style={styles.settingLabel}>Proximity Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Neutral.border, true: Accent.primaryLight }}
              thumbColor={notificationsEnabled ? Accent.primary : Neutral.textTertiary}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={handleClearHistory} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Clear Local Cache</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Neutral.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Disconnect Spotify</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Echo v1.0.0</Text>
    </ScrollView>
  );
}
