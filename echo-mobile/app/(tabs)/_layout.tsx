import { Redirect } from 'expo-router';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Accent, Neutral } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const { isAuth, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) return null;
  if (!isAuth) return <Redirect href="/auth/login" />;

  return (
    <TopTabs
      tabBarPosition="bottom"
      initialRouteName="index"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: Neutral.white,
          borderTopColor: Neutral.borderLight,
          borderTopWidth: 1,
          paddingBottom: insets.bottom || 8,
          height: 56 + (insets.bottom || 8),
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Accent.primary,
          height: 3,
          top: 0,
        },
        tabBarActiveTintColor: Accent.primary,
        tabBarInactiveTintColor: Neutral.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIcon: ({ color }: { color: string }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'index': iconName = 'home'; break;
            case 'stats': iconName = 'stats-chart'; break;
            case 'radar': iconName = 'radio'; break;
            case 'profile': iconName = 'person-circle'; break;
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <TopTabs.Screen name="index" options={{ title: 'Home' }} />
      <TopTabs.Screen name="stats" options={{ title: 'Stats' }} />
      <TopTabs.Screen name="radar" options={{ title: 'Radar' }} />
      <TopTabs.Screen name="profile" options={{ title: 'Profile' }} />
    </TopTabs>
  );
}
