const AUTH_SESSION_KEY = "cartin.auth.session";

function getStorage(remember) {
  return remember ? localStorage : sessionStorage;
}

export function saveAuthSession(tokenResponse, remember = false) {
  const session = {
    user: tokenResponse.user,
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token,
    expires_in: tokenResponse.expires_in,
    access_token_expires_at:
      Date.now() + tokenResponse.expires_in * 1000,
    remember,
  };

  clearAuthSession();

  getStorage(remember).setItem(
    AUTH_SESSION_KEY,
    JSON.stringify(session),
  );

  return session;
}

export function loadAuthSession() {
  const persistentSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (persistentSession) {
    try {
      return JSON.parse(persistentSession);
    } catch {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }

  const browserSession = sessionStorage.getItem(AUTH_SESSION_KEY);

  if (browserSession) {
    try {
      return JSON.parse(browserSession);
    } catch {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  }

  return null;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}