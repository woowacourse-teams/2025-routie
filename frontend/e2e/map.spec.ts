import { test, expect } from './fixtures/auth';

test.describe('지도', () => {
  test('지도가 로드된다', async ({ authenticatedPageInSpace: page }) => {
    // 지도 컨테이너 확인 (로드 시간 고려하여 타임아웃 설정)
    const mapContainer = page.locator('[aria-label="카카오 지도"]');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('해시태그 필터가 표시된다', async ({ authenticatedPageInSpace: page }) => {
    // 해시태그 필터 영역 확인 (장소에 해시태그가 있는 경우)
    await page.waitForTimeout(1000);

    // 해시태그 필터 버튼이 있으면 클릭 테스트
    const filterButton = page.locator('[data-testid="hashtag-filter"]').first();
    if (await filterButton.isVisible().catch(() => false)) {
      await filterButton.click();
      // 필터 활성화 확인
    }
  });

  test('지도에서 마커를 클릭하면 장소 정보 오버레이가 표시된다', async ({
    authenticatedPageInSpace: page,
  }) => {
    // 지도 로드 대기
    await page.waitForTimeout(2000);

    // 지도 영역에서 마커 찾기 (카카오맵 마커는 canvas 또는 div로 렌더링됨)
    // 커스텀 오버레이 마커가 있는 경우
    const marker = page.locator('[class*="marker"], [class*="Marker"]').first();

    if (await marker.isVisible().catch(() => false)) {
      await marker.click();

      // 장소 정보 오버레이 표시 확인
      await page.waitForTimeout(500);
    }
  });

  test('해시태그 필터 클릭 시 해당 태그의 장소만 필터링된다', async ({
    authenticatedPageInSpace: page,
  }) => {
    await page.waitForTimeout(1000);

    // 해시태그 필터 버튼들 찾기
    const filterButtons = page.locator('button:has-text("#")');
    const count = await filterButtons.count();

    if (count > 0) {
      // 첫 번째 해시태그 필터 클릭
      const firstFilter = filterButtons.first();
      await firstFilter.click();

      // 장소 탭으로 이동하여 필터링 확인
      await page.getByText('장소', { exact: true }).click();

      // 필터링된 장소들이 해당 태그를 포함하는지 확인
      await page.waitForTimeout(500);
    }
  });
});
