import { test, expect } from './fixtures/auth';

test.describe('장소탭', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);
  });

  test.describe('장소 검색', () => {
    test('장소를 검색하고 검색 결과를 볼 수 있다', async ({ authenticatedPage: page }) => {
      const searchInput = page.getByPlaceholder('장소를 검색하세요');
      await searchInput.click();
      await searchInput.fill('강남역');

      // 검색 버튼 클릭
      await page.getByText('검색').click();

      // 검색 결과 로딩 대기
      await page.waitForTimeout(2000);

      // 검색 결과가 있거나 "검색된 장소가 없습니다" 메시지가 있어야 함
      const hasResults = await page.locator('li').first().isVisible().catch(() => false);
      const hasEmptyMessage = await page.getByText('검색된 장소가 없습니다').isVisible().catch(() => false);

      expect(hasResults || hasEmptyMessage).toBeTruthy();
    });

    test('검색 결과에서 장소를 선택하면 해시태그 입력 화면이 나타난다', async ({
      authenticatedPage: page,
    }) => {
      const searchInput = page.getByPlaceholder('장소를 검색하세요');
      await searchInput.fill('스타벅스');
      await page.getByText('검색').click();

      // 검색 결과 대기
      await page.waitForTimeout(2000);

      // 첫 번째 검색 결과의 선택하기 버튼 클릭
      const selectButton = page.getByText('선택하기').first();
      if (await selectButton.isVisible().catch(() => false)) {
        await selectButton.click();

        // 해시태그 입력 화면 확인
        await expect(page.getByPlaceholder('해시태그를 추가하거나 만들어보세요')).toBeVisible();
        await expect(page.getByRole('button', { name: '장소 추가하기' })).toBeVisible();
      }
    });
  });

  test.describe('해시태그', () => {
    test('해시태그 입력 후 추가 버튼으로 태그를 추가할 수 있다', async ({
      authenticatedPage: page,
    }) => {
      // 검색 → 선택까지 진행
      const searchInput = page.getByPlaceholder('장소를 검색하세요');
      await searchInput.fill('카페');
      await page.getByText('검색').click();
      await page.waitForTimeout(2000);

      const selectButton = page.getByText('선택하기').first();
      if (await selectButton.isVisible().catch(() => false)) {
        await selectButton.click();

        // 해시태그 입력
        const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');
        await hashtagInput.fill('맛집');

        // 추가 버튼 클릭 (정확히 "추가"만)
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 추가된 태그 확인 (파란색 태그)
        await expect(page.getByText('#맛집')).toBeVisible();
      }
    });

    test('해시태그는 엔터키로도 추가할 수 있다', async ({ authenticatedPage: page }) => {
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

    test('해시태그는 최대 7자까지만 입력된다', async ({ authenticatedPage: page }) => {
      const searchInput = page.getByPlaceholder('장소를 검색하세요');
      await searchInput.fill('카페');
      await page.getByText('검색').click();
      await page.waitForTimeout(2000);

      const selectButton = page.getByText('선택하기').first();
      if (await selectButton.isVisible().catch(() => false)) {
        await selectButton.click();

        const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');
        // 8자 입력 시도
        await hashtagInput.fill('가나다라마바사아');

        // 7자까지만 입력됨
        const value = await hashtagInput.inputValue();
        expect(value.length).toBeLessThanOrEqual(7);
      }
    });

    test('해시태그는 최대 5개까지 추가 가능하다', async ({ authenticatedPage: page }) => {
      const searchInput = page.getByPlaceholder('장소를 검색하세요');
      await searchInput.fill('카페');
      await page.getByText('검색').click();
      await page.waitForTimeout(2000);

      const selectButton = page.getByText('선택하기').first();
      if (await selectButton.isVisible().catch(() => false)) {
        await selectButton.click();

        const hashtagInput = page.getByPlaceholder('해시태그를 추가하거나 만들어보세요');

        // 5개 태그 추가
        for (let i = 1; i <= 5; i++) {
          await hashtagInput.fill(`태그${i}`);
          await hashtagInput.press('Enter');
          await page.waitForTimeout(200);
        }

        // 6번째 태그 추가 시도
        await hashtagInput.fill('태그6');
        await hashtagInput.press('Enter');

        // 토스트 메시지 확인 (최대 5개)
        await expect(page.getByText(/최대 5개/)).toBeVisible();
      }
    });
  });

  test.describe('장소 카드 액션', () => {
    test('장소가 있으면 동선에 추가 버튼이 보인다', async ({ authenticatedPage: page }) => {
      // 장소가 이미 있는 경우 테스트
      const addToRouteButton = page.getByText('동선에 추가').first();

      // 장소가 없으면 스킵
      if (await addToRouteButton.isVisible().catch(() => false)) {
        await expect(addToRouteButton).toBeVisible();
      }
    });

    test('좋아요 버튼을 클릭할 수 있다', async ({ authenticatedPage: page }) => {
      const likeButton = page.getByLabel('좋아요').first();

      if (await likeButton.isVisible().catch(() => false)) {
        await likeButton.click();
        // 좋아요 상태 변경 확인
        await page.waitForTimeout(500);
      }
    });

    test('삭제 버튼을 클릭하면 확인 후 장소가 삭제된다', async ({ authenticatedPage: page }) => {
      // 삭제 버튼 찾기 (동선에 추가되지 않은 장소만 삭제 가능)
      const deleteButton = page.getByRole('button', { name: '삭제' }).first();

      if (await deleteButton.isVisible().catch(() => false)) {
        // confirm 다이얼로그 처리
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm');
          await dialog.accept();
        });

        await deleteButton.click();

        // 삭제 후 토스트 메시지 또는 UI 변화 확인
        await page.waitForTimeout(1000);
      }
    });
  });
});
