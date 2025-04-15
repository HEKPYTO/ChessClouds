import { 
  AuthCallbackResult, 
  GoogleCognitoJwtPayload, 
  JwtParseResult, 
  UserInfo 
} from '@/types/googleAuthTypes';

export const initiateGoogleAuth = (redirectPath?: string): void => {
  const authEndpoint = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT;
  if (!authEndpoint) {
    console.error('Google Auth endpoint not configured');
    localStorage.setItem(
      'auth_error',
      'Authentication endpoint not configured'
    );
    return;
  }

  if (redirectPath && typeof window !== 'undefined') {
    sessionStorage.setItem('auth_redirect', redirectPath);
  }

  localStorage.removeItem('auth_error');
  window.location.href = authEndpoint;
};

export const handleAuthCallback = (): AuthCallbackResult => {
  if (typeof window === 'undefined') {
    return { token: null, error: null, redirectPath: null };
  }

  const hash = window.location.hash;

  if (!hash) {
    return { token: null, error: null, redirectPath: null };
  }

  const params = new URLSearchParams(hash.substring(1));
  const idToken = params.get('id_token');
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  const redirectPath = sessionStorage.getItem('auth_redirect');

  if (error) {
    const errorMessage = errorDescription || `Authentication error: ${error}`;
    localStorage.setItem('auth_error', errorMessage);
    return { token: null, error, redirectPath: '/' };
  }

  if (idToken) {
    localStorage.setItem('id_token', idToken);

    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('token_expiry', expiryTime.toString());

    sessionStorage.removeItem('auth_redirect');
    localStorage.removeItem('auth_error');

    const userInfo = parseJwt(idToken);
    if (userInfo) {
      localStorage.setItem('user_info', JSON.stringify(userInfo));
    }

    return {
      token: idToken,
      error: null,
      redirectPath: redirectPath || '/home',
    };
  }

  return {
    token: idToken,
    error,
    redirectPath,
  };
};

export const getAuthError = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('auth_error');
};

export const clearAuthError = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('auth_error');
};

export const parseJwt = (token: string): JwtParseResult => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as GoogleCognitoJwtPayload;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

export const getUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const userInfoStr = localStorage.getItem('user_info');

  if (!userInfoStr) {
    const token = getAuthToken();
    if (token) {
      const userInfo = parseJwt(token);
      if (userInfo) {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        return userInfo as UserInfo; // Cast to UserInfo is safe now with updated types
      }
    }
    return null;
  }

  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

export const getUsername = (): string => {
  const userInfo = getUserInfo();

  if (userInfo) {
    return (
      userInfo.username ||
      userInfo['cognito:username'] ||
      userInfo.email?.split('@')[0] ||
      'User'
    );
  }

  return 'User';
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('id_token');
  const expiryTimeStr = localStorage.getItem('token_expiry');

  if (token && expiryTimeStr) {
    const expiryTime = parseInt(expiryTimeStr, 10);
    if (Date.now() > expiryTime) {
      localStorage.removeItem('id_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('user_info');
      return null;
    }
  }

  return token;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const signOut = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('id_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user_info');
    window.location.href = '/';
  } catch (error) {
    localStorage.setItem('auth_error', 'Failed to sign out properly: ' + error);
    window.location.href = '/';
  }
};