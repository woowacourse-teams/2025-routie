import { logout } from '@/@common/utils/logout';

import { apiClient } from '..';

vitest.mock('@/@common/utils/logout', () => ({
  logout: vitest.fn(),
}));

describe('apiClient', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('401 + ATH-002일 때 logout 호출', async () => {
    global.fetch = vitest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({
          code: 'ATH-002',
          detail: '인증 정보가 유효하지 않습니다.',
        }),
      } as Response),
    );

    await apiClient.get('/v1/participants/me');
    expect(logout).toHaveBeenCalled();
  });

  it('기타 에러 코드일 때 logout 호출 안 함', async () => {
    global.fetch = vitest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ code: '1030' }),
      } as Response),
    );

    await expect(apiClient.get('/v1/participants/me')).rejects.toThrow(
      '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.',
    );
    expect(logout).not.toHaveBeenCalled();
  });
});
