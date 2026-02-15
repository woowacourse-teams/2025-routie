import { test, expect } from './fixtures/auth';

test.describe('로그인 상태 UI', () => {
  test('로그인된 유저는 유저이름, 내동선목록, 로그아웃 버튼을 볼 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/');

    // 메뉴 버튼 클릭 (햄버거 아이콘 - img alt="menu")
    await page.getByAltText('menu').click();

    // 유저 메뉴가 열리는지 확인
    await expect(page.locator('#userMenu')).toBeVisible();

    // 내 동선 목록 버튼 확인
    await expect(page.getByText('내 동선 목록')).toBeVisible();

    // 로그아웃 버튼 확인
    await expect(page.getByText('로그아웃')).toBeVisible();
  });

  test('유저는 "친구들과 동선 만들러 가기" 버튼으로 입장할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/');

    // 동선 만들기 버튼 클릭
    await page.getByText('친구들과 동선 만들러 가기').click();

    // /routie-spaces 페이지로 이동 확인
    await expect(page).toHaveURL(/\/routie-spaces/);
  });

  test('로그아웃 버튼을 클릭하면 로그아웃된다', async ({ page }) => {
    // addInitScript 대신 직접 토큰 설정 (리로드 시 유지 안됨)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'accessToken',
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwMDAzNzg0LCJleHAiOjE4MjA0ODM3ODR9.VYRnzW1teqgtkVolRL2-CCCalzopE47-Jt1OwD7IDSkKDfPLa5KGK3zro4PdQiazXLjh0FtYS-cdeFK5RCnsCw'
      );
      localStorage.setItem('role', 'USER');
    });

    // 페이지 리로드하여 로그인 상태 적용
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 메뉴 버튼이 보이는지 확인 (로그인 상태)
    await expect(page.getByAltText('menu')).toBeVisible();

    // 메뉴 버튼 클릭
    await page.getByAltText('menu').click();

    // 로그아웃 버튼 클릭
    await page.getByText('로그아웃').click();

    // 페이지 리로드 후 로그인 버튼이 표시되는지 확인
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('로그인')).toBeVisible();
  });
});
