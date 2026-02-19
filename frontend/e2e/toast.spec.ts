import { test, expect } from './fixtures/auth';

test.describe('토스트 메시지', () => {
  test('링크 복사 시 토스트 메시지가 표시된다', async ({ authenticatedPageInSpace: page }) => {
    // 공유 탭에서 복사 버튼 클릭
    await page.getByText('공유').click();
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await expect(page.getByText('Copy')).toBeEnabled();
    await page.getByText('Copy').click();

    // 복사 성공 확인 (Copied로 변경)
    await expect(page.getByText('Copied')).toBeVisible();
  });
});
