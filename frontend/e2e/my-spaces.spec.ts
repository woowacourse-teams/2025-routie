import { test, expect, cleanupSpaceFromPage } from './fixtures/auth';

test.describe('내 동선 목록', () => {
  test.afterEach(async ({ page, request }) => {
    await cleanupSpaceFromPage(page, request);
  });

  test('메뉴에서 내 동선 목록 버튼으로 페이지 이동', async ({ authenticatedPage: page }) => {
    await page.goto('/');

    await page.getByAltText('menu').click();
    await page.getByText('내 동선 목록').click();

    await expect(page).toHaveURL(/\/manage-routie-spaces/);
  });

  test('새 동선 만들기 버튼으로 새로운 스페이스를 만들 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/manage-routie-spaces');

    const createButton = page.getByText(/새 동선 만들기|새로 만들기/i);
    await expect(createButton).toBeVisible();
    await createButton.click();

    await expect(page).toHaveURL(/\/routie-spaces\?routieSpaceIdentifier=/, { timeout: 10000 });
  });

  test('내 동선 목록에서 스페이스를 삭제할 수 있다', async ({
    spaceWithPlaces: { page },
  }) => {
    await page.goto('/manage-routie-spaces');
    await page.waitForLoadState('networkidle');

    const deleteButtons = page.getByRole('button', { name: '삭제' });
    expect(await deleteButtons.count()).toBeGreaterThan(0);

    const deleteResponsePromise = page.waitForResponse(
      (resp) => resp.url().includes('routie-spaces') && resp.request().method() === 'DELETE',
    );
    await page.evaluate(() => { window.confirm = () => true; });
    await deleteButtons.first().click();

    const deleteResponse = await deleteResponsePromise;
    expect(deleteResponse.ok()).toBeTruthy();
  });
});

test.describe('GUEST 역할 제한', () => {
  test('GUEST 유저는 내 동선 목록 버튼이 보이지 않는다', async ({
    spaceUuid: identifier,
    authenticatedPage: page,
  }) => {
    // 새 컨텍스트에서 게스트로 로그인
    const browser = page.context().browser();
    if (!browser) {
      test.skip(true, 'browser 인스턴스를 가져올 수 없습니다');
      return;
    }
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto(`/routie-spaces?routieSpaceIdentifier=${identifier}`);

    await expect(guestPage.getByPlaceholder('사용할 닉네임을 입력해주세요.')).toBeVisible();
    await guestPage.getByPlaceholder('사용할 닉네임을 입력해주세요.').fill('테스트게스트');
    await guestPage.getByText('비회원으로 계속하기').click();

    await guestPage.waitForTimeout(2000);

    // 3. 메뉴 버튼 클릭 후 내 동선 목록 버튼 없음 확인
    await guestPage.getByAltText('menu').click();

    await expect(guestPage.locator('#userMenu')).toBeVisible();
    await expect(guestPage.getByText('내 동선 목록')).not.toBeVisible();

    const role = await guestPage.evaluate(() => localStorage.getItem('role'));
    expect(role).toBe('GUEST');

    await guestContext.close();
  });
});
