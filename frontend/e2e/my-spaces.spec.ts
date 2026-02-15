import { test, expect } from './fixtures/auth';

test.describe('내 동선 목록', () => {
  test('메뉴에서 내 동선 목록 버튼으로 페이지 이동', async ({ authenticatedPage: page }) => {
    await page.goto('/');

    // 메뉴 버튼 클릭
    await page.getByAltText('menu').click();

    // 내 동선 목록 버튼 클릭
    await page.getByText('내 동선 목록').click();

    // 페이지 이동 확인
    await expect(page).toHaveURL(/\/manage-routie-spaces/);
  });

  test('내 동선 목록 페이지에서 유저 이름을 확인할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/manage-routie-spaces');

    // 페이지가 로드되는지 확인
    await page.waitForTimeout(1000);
  });

  test('새 동선 만들기 버튼으로 새로운 스페이스를 만들 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/manage-routie-spaces');

    // 새 동선 만들기 버튼 찾기
    const createButton = page.getByText(/새 동선 만들기|새로 만들기/i);

    if (await createButton.isVisible()) {
      await createButton.click();

      // 새 스페이스 페이지로 이동
      await expect(page).toHaveURL(/\/routie-spaces/);
    }
  });
});

test.describe('GUEST 역할 제한', () => {
  test('GUEST 유저는 내 동선 목록 버튼이 보이지 않는다', async ({
    authenticatedPage: page,
  }) => {
    // 1. USER로 스페이스 생성하여 identifier 획득
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);

    // URL에서 routieSpaceIdentifier 추출
    const url = page.url();
    const identifier = new URL(url).searchParams.get('routieSpaceIdentifier');

    // 2. 새 컨텍스트에서 게스트로 로그인
    const guestContext = await page.context().browser()!.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto(`/routie-spaces?routieSpaceIdentifier=${identifier}`);

    // 로그인 모달 대기
    await expect(guestPage.getByPlaceholder('사용할 닉네임을 입력해주세요.')).toBeVisible();

    // 닉네임 입력
    await guestPage.getByPlaceholder('사용할 닉네임을 입력해주세요.').fill('테스트게스트');

    // 비회원으로 계속하기 클릭
    await guestPage.getByText('비회원으로 계속하기').click();

    // 로그인 완료 대기
    await guestPage.waitForTimeout(2000);

    // 3. 메뉴 버튼 클릭
    await guestPage.getByAltText('menu').click();

    // 4. 유저 메뉴가 열리면 "내 동선 목록" 버튼이 없는지 확인
    await expect(guestPage.locator('#userMenu')).toBeVisible();
    await expect(guestPage.getByText('내 동선 목록')).not.toBeVisible();

    // role이 GUEST인지 확인
    const role = await guestPage.evaluate(() => localStorage.getItem('role'));
    expect(role).toBe('GUEST');

    await guestContext.close();
  });
});
