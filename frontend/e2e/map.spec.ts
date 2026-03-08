import { test, expect } from './fixtures/auth';

test.describe('지도', () => {
  test('지도가 로드된다', async ({ authenticatedPageInSpace: page }) => {
    // 지도 컨테이너 확인 (로드 시간 고려하여 타임아웃 설정)
    const mapContainer = page.locator('[aria-label="카카오 지도"]');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

});
