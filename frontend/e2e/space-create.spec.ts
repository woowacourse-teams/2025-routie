import { test, expect } from './fixtures/auth';

test.describe('루티스페이스 생성', () => {
  test('버튼 클릭 시 루티스페이스가 생성되고 입장된다', async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();

    await page.waitForURL(/\/routie-spaces\?routieSpaceIdentifier=/, { timeout: 10000 });

    const url = new URL(page.url());
    expect(url.searchParams.get('routieSpaceIdentifier')).toBeTruthy();
  });
});

test.describe('루티스페이스 이름 수정', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);
  });

  test('방장은 수정 버튼으로 루티스페이스 이름을 수정할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    await page.getByText('수정').click();

    const nameInput = page.getByRole('textbox').first();
    await expect(nameInput).toBeVisible();

    await nameInput.clear();
    await nameInput.fill('테스트 스페이스');

    await page.getByText('저장').click();

    await expect(page.getByText('테스트 스페이스')).toBeVisible();
  });

  test('루티스페이스 이름은 15자를 초과할 수 없다', async ({ authenticatedPage: page }) => {
    await page.getByText('수정').click();

    const nameInput = page.getByRole('textbox').first();
    await nameInput.clear();
    await nameInput.fill('가나다라마바사아자차카타파하히후');
    await page.getByText('저장').click();

    await expect(page.getByText(/15자 이하/)).toBeVisible();
  });

  test('루티스페이스 이름은 비어있을 수 없다', async ({ authenticatedPage: page }) => {
    await page.getByText('수정').click();

    const nameInput = page.getByRole('textbox').first();
    await nameInput.clear();
    await page.getByText('저장').click();

    await expect(page.getByText(/비어있을 수 없습니다/)).toBeVisible();
  });
});
