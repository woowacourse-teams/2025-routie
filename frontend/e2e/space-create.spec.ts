import { test, expect } from './fixtures/auth';

test.describe('루티스페이스 생성 및 수정', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);
  });

  test('방장은 수정 버튼으로 루티스페이스 이름을 수정할 수 있다', async ({
    authenticatedPage: page,
  }) => {
    // 수정 버튼 클릭
    await page.getByText('수정').click();

    // 입력 필드가 나타나는지 확인 (검색창이 아닌 첫 번째 input)
    const nameInput = page.getByRole('textbox').first();
    await expect(nameInput).toBeVisible();

    // 새 이름 입력
    await nameInput.clear();
    await nameInput.fill('테스트 스페이스');

    // 저장 버튼 클릭
    await page.getByText('저장').click();

    // 변경된 이름이 표시되는지 확인
    await expect(page.getByText('테스트 스페이스')).toBeVisible();
  });

  test('루티스페이스 이름은 15자를 초과할 수 없다', async ({ authenticatedPage: page }) => {
    await page.getByText('수정').click();

    const nameInput = page.getByRole('textbox').first();
    await nameInput.clear();

    // 16자 입력 시도
    await nameInput.fill('가나다라마바사아자차카타파하히후');
    await page.getByText('저장').click();

    // 에러 토스트 메시지 확인
    await expect(page.getByText(/15자 이하/)).toBeVisible();
  });

  test('루티스페이스 이름은 비어있을 수 없다', async ({ authenticatedPage: page }) => {
    await page.getByText('수정').click();

    const nameInput = page.getByRole('textbox').first();
    await nameInput.clear();
    await page.getByText('저장').click();

    // 에러 토스트 메시지 확인
    await expect(page.getByText(/비어있을 수 없습니다/)).toBeVisible();
  });
});
