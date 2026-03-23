import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import UserMenuButton from '../UserMenuButton';

vi.mock('@/@common/utils/logout', () => ({
  logout: vi.fn(),
}));

vi.mock('@/domains/auth/components/UserMenu/UserMenu', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <div id="userMenu" data-testid="user-menu">
      <button type="button">내 동선 목록</button>
      <button type="button" onClick={onClick}>
        로그아웃
      </button>
    </div>
  ),
}));

const openUserMenu = async () => {
  const triggerButton = screen.getByRole('button', { name: '사용자 메뉴 열기' });

  await userEvent.setup().click(triggerButton);

  return triggerButton;
};

describe('UserMenuButton', () => {
  it('초기 상태에서 메뉴는 닫혀 있고 접근성 속성을 노출한다', () => {
    render(<UserMenuButton positioning="relative" />);

    const triggerButton = screen.getByRole('button', {
      name: '사용자 메뉴 열기',
    });

    expect(triggerButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
  });

  it('트리거 버튼 클릭 시 메뉴를 열고 aria-expanded를 갱신한다', async () => {
    render(<UserMenuButton positioning="relative" />);

    const triggerButton = await openUserMenu();

    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('메뉴 내부 클릭만으로는 메뉴가 닫히지 않는다', async () => {
    render(<UserMenuButton positioning="relative" />);

    await openUserMenu();

    await userEvent.setup().click(screen.getByRole('button', { name: '내 동선 목록' }));

    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('메뉴 외부를 클릭하면 메뉴가 닫히고 aria-expanded를 false로 되돌린다', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <UserMenuButton positioning="relative" />
        <button type="button">외부 버튼</button>
      </div>,
    );

    const triggerButton = screen.getByRole('button', {
      name: '사용자 메뉴 열기',
    });

    await user.click(triggerButton);
    await user.click(screen.getByRole('button', { name: '외부 버튼' }));

    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape 입력 시 메뉴가 닫히고 트리거 버튼으로 포커스가 돌아간다', async () => {
    const user = userEvent.setup();

    render(<UserMenuButton positioning="relative" />);

    const triggerButton = screen.getByRole('button', {
      name: '사용자 메뉴 열기',
    });

    await user.click(triggerButton);
    await user.keyboard('{Escape}');

    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
    expect(triggerButton).toHaveFocus();
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape 이외의 키 입력으로는 메뉴가 닫히지 않는다', async () => {
    const user = userEvent.setup();

    render(<UserMenuButton positioning="relative" />);

    await openUserMenu();
    await user.keyboard('a');

    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('열리지 않은 상태에서 외부 클릭이나 Escape 입력이 발생해도 메뉴를 다시 열지 않는다', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <UserMenuButton positioning="relative" />
        <button type="button">외부 버튼</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: '외부 버튼' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '사용자 메뉴 열기' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });
});
