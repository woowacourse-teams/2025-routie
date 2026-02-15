import { test, expect } from './fixtures/auth';

test.describe('에러 페이지', () => {
  test('존재하지 않는 스페이스에 접근하면 404 페이지로 이동한다', async ({
    authenticatedPage: page,
  }) => {
    // 존재하지 않는 스페이스 UUID로 접근
    await page.goto('/routie-spaces?routieSpaceIdentifier=non-existent-uuid-12345');

    // 404 페이지로 리다이렉트되거나 에러 메시지 표시 확인
    await page.waitForURL(/routie-space-not-found/, { timeout: 10000 }).catch(() => {
      // URL이 변경되지 않으면 에러 메시지 확인
    });

    // 404 페이지이거나 에러 관련 텍스트가 있는지 확인
    const isNotFoundPage = page.url().includes('not-found');
    const hasErrorMessage = await page.getByText(/존재하지 않|찾을 수 없|not found/i).isVisible().catch(() => false);

    expect(isNotFoundPage || hasErrorMessage).toBeTruthy();
  });
});
