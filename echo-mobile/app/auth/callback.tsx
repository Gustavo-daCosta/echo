import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { exchangeCodeAsync } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { Accent } from '@/constants/theme';
import { saveTokens } from '@/services/spotify';
import { useAuth } from '@/context/AuthContext';

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function CallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; state?: string }>();
  const router = useRouter();
  const { onTokensSaved } = useAuth();

  useEffect(() => {
    (async () => {
      const code = params.code;
      if (!code) {
        router.replace('/auth/login');
        return;
      }

      const codeVerifier = await SecureStore.getItemAsync('pkce_code_verifier');
      const redirectUri = await SecureStore.getItemAsync('pkce_redirect_uri');
      if (!codeVerifier || !redirectUri) {
        console.error('[Callback] Missing PKCE params');
        router.replace('/auth/login');
        return;
      }

      console.log('[Callback] Exchanging code, redirectUri:', redirectUri);
      try {
        const tokenResult = await exchangeCodeAsync(
          {
            clientId: SPOTIFY_CLIENT_ID,
            code,
            redirectUri,
            extraParams: { code_verifier: codeVerifier },
          },
          discovery,
        );

        await SecureStore.deleteItemAsync('pkce_code_verifier');
        await SecureStore.deleteItemAsync('pkce_redirect_uri');
        await saveTokens(
          tokenResult.accessToken,
          tokenResult.refreshToken ?? '',
          tokenResult.expiresIn ?? 3600,
        );

        console.log('[Callback] Tokens saved, notifying AuthContext');
        onTokensSaved();
        router.replace('/(tabs)');
      } catch (err) {
        console.error('[Callback] Exchange failed:', err);
        router.replace('/auth/login');
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color={Accent.primary} />
    </View>
  );
}
