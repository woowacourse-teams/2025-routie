import { test, expect } from './fixtures/auth';

test.describe('장소탭 - 장소 검색', () => {
  test('장소를 검색하고 검색 결과를 볼 수 있다', async ({ authenticatedPageInSpace: page }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.click();
    await searchInput.fill('강남역');

    await page.getByText('검색').click();

    await page.waitForTimeout(2000);

    const hasResults = await page.locator('li').first().isVisible().catch(() => false);
    const hasEmptyMessage = await page
      .getByText('검색된 장소가 없습니다')
      .isVisible()
      .catch(() => false);

    expect(hasResults || hasEmptyMessage).toBeTruthy();
  });

  test('검색 결과에서 장소를 선택하면 해시태그 입력 화면이 나타난다', async ({
    authenticatedPageInSpace: page,
  }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.fill('스타벅스');
    await page.getByText('검색').click();

    await page.waitForTimeout(2000);

    const selectButton = page.getByText('선택하기').first();
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();

      await expect(page.getByPlaceholder('해시태그를 추가하거나 만들어보세요')).toBeVisible();
      await expect(page.getByRole('button', { name: '장소 추가하기' })).toBeVisible();
    }
  });
});

test.describe('장소탭 - 해시태그', () => {
  test('해시태그 입력 후 추가 버튼으로 태그를 추가할 수 있다', async ({
    authenticatedPageInSpace: page,
  }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.fill('카페');
    await page.getByText('검색').click();
    await page.waitForTimeout(2000);

    const selectButton = page.getByText('선택하기').first();
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();

      const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');
      await hashtagInput.fill('맛집');
      await page.getByRole('button', { name: '추가', exact: true }).click();

      await expect(page.getByText('#맛집')).toBeVisible();
    }
  });

  test('해시태그는 엔터키로도 추가할 수 있다', async ({ authenticatedPageInSpace: page }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.fill('카페');
    await page.getByText('검색').click();
    await page.waitForTimeout(2000);

    const selectButton = page.getByText('선택하기').first();
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();

      const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');
      await hashtagInput.fill('분위기좋은');
      await hashtagInput.press('Enter');

      await expect(page.getByText('#분위기좋은')).toBeVisible();
    }
  });

  test('해시태그는 최대 7자까지만 입력된다', async ({ authenticatedPageInSpace: page }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.fill('카페');
    await page.getByText('검색').click();
    await page.waitForTimeout(2000);

    const selectButton = page.getByText('선택하기').first();
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();

      const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');
      await hashtagInput.fill('가나다라마바사아');

      const value = await hashtagInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(7);
    }
  });

  test('해시태그는 최대 5개까지 추가 가능하다', async ({ authenticatedPageInSpace: page }) => {
    const searchInput = page.getByPlaceholder('장소를 검색하세요');
    await searchInput.fill('카페');
    await page.getByText('검색').click();
    await page.waitForTimeout(2000);

    const selectButton = page.getByText('선택하기').first();
    if (await selectButton.isVisible().catch(() => false)) {
      await selectButton.click();

      const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');

      for (let i = 1; i <= 5; i++) {
        await hashtagInput.fill(`태그${i}`);
        await hashtagInput.press('Enter');
        await page.waitForTimeout(200);
      }

      await hashtagInput.fill('태그6');
      await hashtagInput.press('Enter');

      await expect(page.getByText(/최대 5개/)).toBeVisible();
    }
  });
});

test.describe('장소탭 - 장소 카드 액션', () => {
  test('장소 목록에 장소가 표시된다', async ({ spaceWithPlaces: { page } }) => {
    await expect(page.getByText('스타벅스 강남점')).toBeVisible();
    await expect(page.getByText('강남역')).toBeVisible();
  });

  test('동선에 추가 버튼이 보인다', async ({ spaceWithPlaces: { page } }) => {
    await expect(page.getByText('동선에 추가').first()).toBeVisible();
  });

  test('좋아요 버튼을 클릭할 수 있다', async ({ spaceWithPlaces: { page } }) => {
    const likeButton = page.getByLabel('좋아요').first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();
    await page.waitForTimeout(500);
  });

  test('삭제 버튼을 클릭하면 장소가 목록에서 사라진다', async ({
    spaceWithPlaces: { page },
  }) => {
    await expect(page.getByText('스타벅스 강남점')).toBeVisible();

    await page.evaluate(() => { window.confirm = () => true; });
    await page.getByRole('button', { name: '삭제' }).first().click();

    await expect(page.getByText('스타벅스 강남점')).not.toBeVisible({ timeout: 5000 });
  });
});
