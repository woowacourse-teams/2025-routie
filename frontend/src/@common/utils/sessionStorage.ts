export const sessionStorageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`세션 스토리지 아이템 파싱 실패: '${key}':`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`세션 스토리지 아이템 설정 실패: '${key}':`, error);
    }
  },

  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`세션 스토리지 아이템 삭제 실패: '${key}':`, error);
    }
  },
};
