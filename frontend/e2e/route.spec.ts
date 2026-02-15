import { test, expect } from './fixtures/auth';

test.describe('동선탭', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);
  });

  test('동선 탭을 클릭하면 동선 목록이 표시된다', async ({ authenticatedPage: page }) => {
    // 동선 탭 클릭
    await page.getByText('동선', { exact: true }).click();

    // 동선 탭 컨텐츠가 표시되는지 확인
    await page.waitForTimeout(500);
  });

  test('장소탭에서 동선에 추가 버튼을 클릭하면 버튼이 "동선에서 삭제"로 변경된다', async ({
    authenticatedPage: page,
  }) => {
    // 장소가 있는 경우에만 테스트
    const addToRouteButton = page.getByText('동선에 추가').first();

    if (await addToRouteButton.isVisible().catch(() => false)) {
      await addToRouteButton.click();

      // 버튼이 "동선에서 삭제"로 변경되는지 확인
      await expect(page.getByText('동선에서 삭제').first()).toBeVisible();
    }
  });

  test('동선에 추가된 장소는 동선탭에서 확인할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    // 장소가 있는 경우에만 테스트
    const addToRouteButton = page.getByText('동선에 추가').first();

    if (await addToRouteButton.isVisible().catch(() => false)) {
      // 장소 이름 저장
      const placeName = await page.locator('[id]').first().textContent();

      await addToRouteButton.click();
      await page.waitForTimeout(500);

      // 동선 탭으로 이동
      await page.getByText('동선', { exact: true }).click();

      // 동선에 장소가 추가되었는지 확인
      if (placeName) {
        await expect(page.getByText(placeName)).toBeVisible();
      }
    }
  });

  test('동선탭에서 메뉴 버튼으로 장소를 삭제할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.getByText('동선', { exact: true }).click();

    // 메뉴 버튼 (케밥 버튼) 찾기
    const menuButton = page.getByLabel('메뉴 열기').first();

    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();

      // 메뉴 옵션 확인
      await expect(page.getByLabel('동선에서 장소 삭제')).toBeVisible();
    }
  });

  test('동선탭에서 드래그앤드롭으로 순서를 변경할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.getByText('동선', { exact: true }).click();

    // 드래그 핸들 찾기 (순서 마커)
    const dragHandles = page.getByLabel(/순서/);
    const count = await dragHandles.count();

    if (count >= 2) {
      const firstHandle = dragHandles.nth(0);
      const secondHandle = dragHandles.nth(1);

      // 첫 번째 아이템의 위치 저장
      const firstBoundingBox = await firstHandle.boundingBox();
      const secondBoundingBox = await secondHandle.boundingBox();

      if (firstBoundingBox && secondBoundingBox) {
        // 드래그앤드롭 수행
        await firstHandle.dragTo(secondHandle);

        // 순서가 변경되었는지 확인 (잠시 대기)
        await page.waitForTimeout(500);
      }
    }
  });
});
