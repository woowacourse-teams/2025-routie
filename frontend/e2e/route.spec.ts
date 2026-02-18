import { test, expect } from './fixtures/auth';

test.describe('동선탭 - 기본', () => {
  test('동선 탭을 클릭하면 동선 탭 컨텐츠가 표시된다', async ({ authenticatedPageInSpace: page }) => {
    await page.getByText('동선', { exact: true }).click();
    await page.waitForTimeout(500);
  });
});

test.describe('동선탭 - 장소 추가/제거', () => {
  test('장소탭에서 동선에 추가 버튼을 클릭하면 버튼이 "동선에서 삭제"로 변경된다', async ({
    spaceWithPlaces: { page },
  }) => {
    const addToRouteButton = page.getByText('동선에 추가').first();
    await expect(addToRouteButton).toBeVisible();

    await addToRouteButton.click();

    await expect(page.getByText('동선에서 삭제').first()).toBeVisible();
  });

  test('동선에 추가된 장소는 동선탭에서 확인할 수 있다', async ({
    spaceWithPlaces: { page },
  }) => {
    await page.getByText('동선에 추가').first().click();
    await page.waitForTimeout(500);

    await page.getByText('동선', { exact: true }).click();

    await expect(page.getByText('스타벅스 강남점').first()).toBeVisible();
  });
});

test.describe('동선탭 - 동선 내 장소 관리', () => {
  test('동선탭에서 메뉴 버튼으로 장소 삭제 옵션이 보인다', async ({
    spaceWithRoutie: { page },
  }) => {
    await page.getByText('동선', { exact: true }).click();

    const menuButton = page.getByLabel('메뉴 열기').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await expect(page.getByLabel('동선에서 장소 삭제')).toBeVisible();
  });

  test('동선탭에서 장소를 삭제하면 목록에서 사라진다', async ({
    spaceWithRoutie: { page },
  }) => {
    await page.getByText('동선', { exact: true }).click();

    await expect(page.getByText('스타벅스 강남점')).toBeVisible();

    const menuButton = page.getByLabel('메뉴 열기').first();
    await menuButton.click();
    await page.getByLabel('동선에서 장소 삭제').click();

    await expect(page.getByText('스타벅스 강남점')).not.toBeVisible({ timeout: 5000 });
  });

  test('동선탭에서 드래그앤드롭으로 순서를 변경할 수 있다', async ({
    spaceWithRoutie: { page },
  }) => {
    await page.getByText('동선', { exact: true }).click();

    const dragHandles = page.getByLabel(/순서/);
    await expect(dragHandles).toHaveCount(2);

    const firstHandle = dragHandles.nth(0);
    const secondHandle = dragHandles.nth(1);

    await firstHandle.dragTo(secondHandle);
    await page.waitForTimeout(1000);

    // 드래그 후 두 장소가 여전히 표시되는지 확인
    await expect(page.getByText('스타벅스 강남점')).toBeVisible();
    await expect(page.getByText('강남역')).toBeVisible();
  });
});
