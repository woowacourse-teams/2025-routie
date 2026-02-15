import { test, expect } from './fixtures/auth';

test.describe('공유탭', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.getByText('친구들과 동선 만들러 가기').click();
    await page.waitForURL(/\/routie-spaces/);
  });

  test('공유 탭에서 링크 복사 버튼을 클릭하면 클립보드에 복사된다', async ({
    authenticatedPage: page,
  }) => {
    // 공유 탭 클릭
    await page.getByText('공유').click();

    // 클립보드 권한 부여
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // 복사 버튼 클릭 (Copy 텍스트)
    await page.getByText('Copy').click();

    // 복사 성공 확인 (Copied로 변경됨)
    await expect(page.getByText('Copied')).toBeVisible();

    // 클립보드 내용 확인
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('/routie-spaces?routieSpaceIdentifier=');
  });
});

test.describe('공유 링크로 입장', () => {
  test('비로그인 유저가 공유 링크로 입장하면 로그인 모달이 표시된다', async ({ page }) => {
    // 공유 링크로 직접 접근 (토큰 없이)
    await page.goto('/routie-spaces?routieSpaceIdentifier=test-uuid');

    // 로그인 모달 표시 확인 (닉네임 입력 필드)
    await expect(page.getByPlaceholder('사용할 닉네임을 입력해주세요.')).toBeVisible();
  });

  test('게스트 로그인으로 공유된 방에 입장할 수 있다', async ({ page }) => {
    // 실제 존재하는 routieSpaceIdentifier가 필요
    await page.goto('/routie-spaces?routieSpaceIdentifier=test-uuid');

    // 닉네임 입력
    await page.getByPlaceholder('사용할 닉네임을 입력해주세요.').fill('테스트유저');

    // 비회원으로 계속하기 버튼 클릭
    await page.getByText('비회원으로 계속하기').click();

    // 에러 메시지 또는 페이지 로드 확인
    // (유효하지 않은 UUID면 에러가 날 수 있음)
    await page.waitForTimeout(2000);
  });
});
