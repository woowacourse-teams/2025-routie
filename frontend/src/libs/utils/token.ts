const createRandomToken = () => {
  const randomFallback = () =>
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  if (typeof crypto === 'undefined') {
    return randomFallback();
  }

  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }

  if (typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  return randomFallback();
};

const TOKEN_SESSION_KEY = 'routie-place-stream-token';

const ensureStreamToken = () => {
  const token = createRandomToken();

  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(TOKEN_SESSION_KEY, token);
  }

  return token;
};

export { ensureStreamToken };
