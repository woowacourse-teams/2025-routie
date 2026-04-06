import { test, expect } from './fixtures/auth';

test.describe('에러 페이지', () => {
  test('존재하지 않는 스페이스에 접근하면 404 페이지로 이동한다', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/routie-spaces?routieSpaceIdentifier=non-existent-uuid-12345');

    await expect(page).toHaveURL(/routie-space-not-found/, { timeout: 20000 });
  });
});
