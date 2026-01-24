import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { MapSdkLoader } from '../core/MapSdkLoader';

import type { MapAdapter } from '../types/adapter.types';

/**
 * Mock MapAdapter 생성 헬퍼
 */
const createMockAdapter = (
  options?: { shouldFail?: boolean; alreadyLoaded?: boolean },
): MapAdapter => ({
  isLoaded: vi.fn(() => options?.alreadyLoaded ?? false),
  load: vi.fn(() =>
    options?.shouldFail
      ? Promise.reject(new Error('SDK 로드 실패'))
      : Promise.resolve(),
  ),
  createLatLng: vi.fn(),
  createMap: vi.fn(),
  relayout: vi.fn(),
});

describe('MapSdkLoader', () => {
  beforeEach(() => {
    MapSdkLoader.resetForTesting();
  });

  afterEach(() => {
    MapSdkLoader.resetForTesting();
  });

  describe('기본 동작', () => {
    it('init() 호출 시 idle → loading → loaded 상태 전이', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);
      const states: string[] = [];

      loader.subscribe(() => {
        states.push(loader.getSnapshot().status);
      });

      expect(loader.getSnapshot().status).toBe('idle');

      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      expect(states).toContain('loading');
      expect(states).toContain('loaded');
    });

    it('loading 상태에서 init() 재호출 시 무시해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      expect(loader.getSnapshot().status).toBe('loading');

      // loading 상태에서 init() 재호출
      loader.init({ appkey: 'another-key' });

      // load가 한 번만 호출되어야 함
      expect(mockAdapter.load).toHaveBeenCalledTimes(1);
    });

    it('loaded 상태에서 init() 재호출 시 무시해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      // loaded 상태에서 init() 재호출
      loader.init({ appkey: 'another-key' });

      // load가 한 번만 호출되어야 함
      expect(mockAdapter.load).toHaveBeenCalledTimes(1);
    });

    it('load() 중복 호출 시 같은 Promise 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      const promise1 = loader.load();
      const promise2 = loader.load();

      expect(promise1).toBe(promise2);
      expect(mockAdapter.load).toHaveBeenCalledTimes(1);
    });

    it('이미 SDK가 로드된 경우 바로 loaded 상태가 되어야 한다', async () => {
      const mockAdapter = createMockAdapter({ alreadyLoaded: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      expect(loader.getSnapshot().status).toBe('loaded');
      expect(mockAdapter.load).not.toHaveBeenCalled();
    });
  });

  describe('에러 복구 로직', () => {
    it('로드 실패 시 error 상태로 전이해야 한다', async () => {
      const mockAdapter = createMockAdapter({ shouldFail: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);

      // load()가 throw하므로 catch 처리
      loader.init({ appkey: 'test-key' });
      await loader.load().catch(() => {});

      expect(loader.getSnapshot().status).toBe('error');
      expect(loader.getSnapshot().error).toBeInstanceOf(Error);
      expect(loader.getSnapshot().error?.message).toBe('SDK 로드 실패');
    });

    it('에러 상태에서 retry() 호출 시 재시도해야 한다', async () => {
      const mockAdapter = createMockAdapter({ shouldFail: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });
      await loader.load().catch(() => {});

      expect(loader.getSnapshot().status).toBe('error');

      // 이제 성공하도록 mock 변경
      vi.mocked(mockAdapter.load).mockResolvedValueOnce(undefined);

      await loader.retry();

      expect(loader.getSnapshot().status).toBe('loaded');
      // load가 2번 호출되어야 함 (초기 실패 + retry)
      expect(mockAdapter.load).toHaveBeenCalledTimes(2);
    });

    it('에러 상태에서 init() 호출 시 재초기화해야 한다', async () => {
      const mockAdapter = createMockAdapter({ shouldFail: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });
      await loader.load().catch(() => {});

      expect(loader.getSnapshot().status).toBe('error');

      // 이제 성공하도록 mock 변경
      vi.mocked(mockAdapter.load).mockResolvedValueOnce(undefined);

      loader.init({ appkey: 'test-key' });
      await loader.load();

      expect(loader.getSnapshot().status).toBe('loaded');
      // load가 2번 호출되어야 함 (초기 실패 + init 재호출)
      expect(mockAdapter.load).toHaveBeenCalledTimes(2);
    });

    it('retry() 성공 시 loaded 상태로 전이해야 한다', async () => {
      const mockAdapter = createMockAdapter({ shouldFail: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);
      const states: string[] = [];

      loader.subscribe(() => {
        states.push(loader.getSnapshot().status);
      });

      loader.init({ appkey: 'test-key' });
      await loader.load().catch(() => {});

      expect(loader.getSnapshot().status).toBe('error');

      // 이제 성공하도록 mock 변경
      vi.mocked(mockAdapter.load).mockResolvedValueOnce(undefined);

      await loader.retry();

      expect(loader.getSnapshot().status).toBe('loaded');
      // loading → error → idle(resetError) → loading → loaded 순서
      expect(states).toEqual(['loading', 'error', 'idle', 'loading', 'loaded']);
    });

    it('loadPromise가 실패 후 null로 초기화되어야 한다', async () => {
      const mockAdapter = createMockAdapter({ shouldFail: true });
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });
      await loader.load().catch(() => {});

      expect(loader.getSnapshot().status).toBe('error');

      // 성공하도록 mock 변경하고 retry 호출
      vi.mocked(mockAdapter.load).mockResolvedValueOnce(undefined);

      // retry가 새 Promise를 생성할 수 있어야 함 (loadPromise가 null이므로)
      const retryPromise = loader.retry();

      await retryPromise;

      expect(loader.getSnapshot().status).toBe('loaded');
    });

    it('에러 상태가 아닐 때 retry()는 기존 load()와 동일하게 동작해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      // loading 상태에서 retry 호출
      const retryPromise = loader.retry();

      await retryPromise;

      // load가 한 번만 호출되어야 함 (기존 promise 반환)
      expect(mockAdapter.load).toHaveBeenCalledTimes(1);
    });
  });

  describe('구독 패턴', () => {
    it('상태 변경 시 구독자에게 알림해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);
      const subscriber = vi.fn();

      loader.subscribe(subscriber);
      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      // loading, loaded 상태 변경 시 각각 호출
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it('구독 해제 후 알림 받지 않아야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);
      const subscriber = vi.fn();

      const unsubscribe = loader.subscribe(subscriber);
      unsubscribe();

      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('getSnapshot()은 캐시된 객체 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      const snapshot1 = loader.getSnapshot();
      const snapshot2 = loader.getSnapshot();

      // 동일한 객체 참조여야 함
      expect(snapshot1).toBe(snapshot2);
    });

    it('상태 변경 시 getSnapshot()은 새 객체 반환해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      const snapshotBefore = loader.getSnapshot();

      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      const snapshotAfter = loader.getSnapshot();

      // 다른 객체 참조여야 함
      expect(snapshotBefore).not.toBe(snapshotAfter);
    });

    it('getServerSnapshot()은 항상 idle 상태 반환해야 한다', async () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      await vi.waitFor(() => {
        expect(loader.getSnapshot().status).toBe('loaded');
      });

      const serverSnapshot = loader.getServerSnapshot();

      expect(serverSnapshot.status).toBe('idle');
      expect(serverSnapshot.error).toBeNull();
    });

    it('getServerSnapshot()은 항상 동일한 객체 참조 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      const snapshot1 = loader.getServerSnapshot();
      const snapshot2 = loader.getServerSnapshot();

      expect(snapshot1).toBe(snapshot2);
    });
  });

  describe('싱글톤 패턴', () => {
    it('getInstance()는 동일한 인스턴스 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader1 = MapSdkLoader.getInstance(mockAdapter);
      const loader2 = MapSdkLoader.getInstance(mockAdapter);

      expect(loader1).toBe(loader2);
    });

    it('resetForTesting() 후 getInstance()는 새 인스턴스 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader1 = MapSdkLoader.getInstance(mockAdapter);

      MapSdkLoader.resetForTesting();

      const loader2 = MapSdkLoader.getInstance(mockAdapter);

      expect(loader1).not.toBe(loader2);
    });
  });

  describe('Adapter 통합', () => {
    it('getAdapter()는 주입된 adapter 반환해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      expect(loader.getAdapter()).toBe(mockAdapter);
    });

    it('load() 시 adapter.load()에 appkey와 libraries 전달해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key', libraries: ['services', 'clusterer'] });

      expect(mockAdapter.load).toHaveBeenCalledWith('test-key', [
        'services',
        'clusterer',
      ]);
    });

    it('libraries가 없으면 빈 배열 전달해야 한다', () => {
      const mockAdapter = createMockAdapter();
      const loader = MapSdkLoader.getInstance(mockAdapter);

      loader.init({ appkey: 'test-key' });

      expect(mockAdapter.load).toHaveBeenCalledWith('test-key', []);
    });
  });
});
