import { test, expect } from './fixtures/auth';

test.describe('지도', () => {
  test('지도가 로드된다', async ({ authenticatedPageInSpace: page }) => {
    // 지도 컨테이너 확인 (로드 시간 고려하여 타임아웃 설정)
    const mapContainer = page.locator('[aria-label="카카오 지도"]');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  // 픽스처의 샘플 장소에 해시태그 데이터가 없어 필터 노출을 보장할 수 없으므로 보류
  test('해시태그 필터가 표시된다', async () => {
    test.skip(true, '해시태그 데이터가 있는 픽스처 추가 후 구현 예정');
  });

  // 카카오맵 SDK 내부 DOM에 의존하여 신뢰성 있는 선택자를 확보하기 어려우므로 보류
  test('지도에서 마커를 클릭하면 장소 정보 오버레이가 표시된다', async () => {
    test.skip(true, '카카오맵 SDK 내부 DOM 의존으로 신뢰성 있는 테스트 구현 어려움');
  });

  // 해시태그 데이터가 있는 픽스처 추가 후 구현 예정
  test('해시태그 필터 클릭 시 해당 태그의 장소만 필터링된다', async () => {
    test.skip(true, '해시태그 데이터가 있는 픽스처 추가 후 구현 예정');
  });
});
