import { test, expect } from './fixtures/auth';

test.describe('공유탭', () => {
  test('공유 탭에서 링크 복사 버튼을 클릭하면 클립보드에 복사된다', async ({
    authenticatedPageInSpace: page,
  }) => {
    await page.getByText('공유').click();
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.getByText('Copy').click();

    await expect(page.getByText('Copied')).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('/routie-spaces?routieSpaceIdentifier=');
  });
});

test.describe('공유 링크로 입장', () => {
  test('비로그인 유저가 공유 링크로 입장하면 로그인 모달이 표시된다', async ({
    page,
    spaceUuid,
  }) => {
    await page.goto(`/routie-spaces?routieSpaceIdentifier=${spaceUuid}`);

    await expect(page.getByPlaceholder('사용할 닉네임을 입력해주세요.')).toBeVisible();
  });

  test('게스트 로그인으로 공유된 방에 입장할 수 있다', async ({ page, spaceUuid }) => {
    await page.goto(`/routie-spaces?routieSpaceIdentifier=${spaceUuid}`);

    await page.getByPlaceholder('사용할 닉네임을 입력해주세요.').fill('테스트유저');
    await page.getByText('비회원으로 계속하기').click();

    await expect(page).toHaveURL(/\/routie-spaces\?routieSpaceIdentifier=/, { timeout: 10000 });
    await expect(page.locator('[aria-label="카카오 지도"]')).toBeVisible({ timeout: 10000 });
  });
});
