/**
 * Auth context — manages Spotify authentication state across the app.
 * In dev builds, the callback screen handles token exchange.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';
import {
  isAuthenticated,
  saveTokens,
  clearTokens,
  getRefreshToken,
  getAccessToken,
} from '@/services/spotify';

WebBrowser.maybeCompleteAuthSession();

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing',
  'user-read-playback-state',
];

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  promptAsync: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  onTokensSaved: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  isLoading: true,
  promptAsync: async () => {},
  logout: async () => {},
  refreshAuth: async () => false,
  onTokensSaved: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const redirectUri = makeRedirectUri({
    scheme: 'echo',
    path: 'auth/callback',
  });

  console.log('[Auth] redirectUri:', redirectUri);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: SCOPES,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discovery,
  );

  // Check existing auth on mount — tokens were saved by callback screen
  useEffect(() => {
    (async () => {
      const auth = await isAuthenticated();
      console.log('[Auth] existing auth:', auth);
      setIsAuth(auth);
      setIsLoading(false);
    })();
  }, []);

  const handleLogin = useCallback(async () => {
    if (!request?.codeVerifier) {
      console.error('[Auth] request not ready');
      return;
    }

    // Store PKCE params so the callback screen can exchange the code
    await SecureStore.setItemAsync('pkce_code_verifier', request.codeVerifier);
    await SecureStore.setItemAsync('pkce_redirect_uri', redirectUri);

    console.log('[Auth] opening Spotify OAuth...');
    await promptAsync();
    // Don't try to exchange here — the callback screen handles it
  }, [request, promptAsync, redirectUri]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: SPOTIFY_CLIENT_ID,
        }).toString(),
      });

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json();
      await saveTokens(
        data.access_token,
        data.refresh_token ?? refreshToken,
        data.expires_in ?? 3600,
      );

      setIsAuth(true);
      return true;
    } catch {
      await clearTokens();
      setIsAuth(false);
      return false;
    }
  }, []);

  const onTokensSaved = useCallback(() => {
    console.log('[Auth] onTokensSaved — setting isAuth=true');
    setIsAuth(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        await fetch('https://accounts.spotify.com/api/token/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token,
            client_id: SPOTIFY_CLIENT_ID,
          }).toString(),
        }).catch(() => {});
      }
    } catch {}
    await clearTokens();
    setIsAuth(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isLoading,
        promptAsync: handleLogin,
        logout,
        refreshAuth,
        onTokensSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
