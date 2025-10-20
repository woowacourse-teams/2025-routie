const TOKEN_STORAGE_KEY = 'routie-place-stream-token';
const TOKEN_BYTE_LENGTH = 6; // 48비트 → base36 9~10자

const createBytes = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

const bytesToBase36 = (bytes: Uint8Array) => {
  let value = 0;
  bytes.forEach((byte) => {
    value = value * 256 + byte;
  });
  return value.toString(36);
};

const createShortToken = () => {
  const token = bytesToBase36(createBytes(TOKEN_BYTE_LENGTH));
  return token.padStart(9, '0');
};

const ensureStreamToken = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createShortToken();
  }

  let token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    token = createShortToken();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  return token;
};

export { ensureStreamToken };
