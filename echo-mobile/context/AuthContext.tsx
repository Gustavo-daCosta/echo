import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
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
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  isLoading: true,
  promptAsync: async () => {},
  logout: async () => {},
  refreshAuth: async () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const redirectUri = makeRedirectUri({
    scheme: 'echo',
  });

  const discoveryWithLogging = {
    ...discovery,
  };

  console.log('[Auth] redirectUri:', redirectUri);
  console.log('[Auth] clientId set:', SPOTIFY_CLIENT_ID ? 'yes' : 'NO — check .env');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: SCOPES,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discoveryWithLogging,
  );

  useEffect(() => {
    console.log('[Auth] response type:', response?.type);
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('[Auth] got code, exchanging for token...');

      (async () => {
        try {
          if (!request?.codeVerifier) {
            console.error('[Auth] no code verifier!');
            return;
          }

          const tokenResult = await exchangeCodeAsync(
            {
              clientId: SPOTIFY_CLIENT_ID,
              code,
              redirectUri,
              extraParams: { code_verifier: request.codeVerifier },
            },
            discovery,
          );

          console.log('[Auth] token received, saving...');
          await saveTokens(
            tokenResult.accessToken,
            tokenResult.refreshToken ?? '',
            tokenResult.expiresIn ?? 3600,
          );

          console.log('[Auth] token saved, setting isAuth=true');
          setIsAuth(true);
        } catch (err) {
          console.error('[Auth] token exchange failed:', err);
        }
      })();
    } else if (response?.type === 'error') {
      console.error('[Auth] response error:', response.params);
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      console.log('[Auth] checking existing auth...');
      const auth = await isAuthenticated();
      console.log('[Auth] existing auth:', auth);
      setIsAuth(auth);
      setIsLoading(false);
    })();
  }, []);

  const handleLogin = useCallback(async () => {
    if (!request) {
      console.error('[Auth] no request object — client ID may be missing');
      return;
    }

    console.log('[Auth] launching Spotify OAuth...');
    const result = await promptAsync();
    console.log('[Auth] promptAsync result type:', result?.type);

    if (result?.type !== 'success') {
      console.log('[Auth] user cancelled or error:', result?.type);
      return;
    }

    try {
      const codeVerifier = request.codeVerifier;
      if (!codeVerifier) throw new Error('No code verifier');

      const tokenResult = await exchangeCodeAsync(
        {
          clientId: SPOTIFY_CLIENT_ID,
          code: result.params.code,
          redirectUri,
          extraParams: { code_verifier: codeVerifier },
        },
        discovery,
      );

      await saveTokens(
        tokenResult.accessToken,
        tokenResult.refreshToken ?? '',
        tokenResult.expiresIn ?? 3600,
      );

      console.log('[Auth] handleLogin: token saved, auth=true');
      setIsAuth(true);
    } catch (err) {
      console.error('[Auth] handleLogin exchange failed:', err);
    }
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

  console.log('[Auth] render state — isAuth:', isAuth, 'isLoading:', isLoading);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isLoading,
        promptAsync: handleLogin,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
