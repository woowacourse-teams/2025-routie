import Header from './Header';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Common/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
    onLoginClick: () => alert('로그인 클릭'),
    onLogoClick: () => alert('로고 클릭'),
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    onLoginClick: () => alert('로그인 클릭'),
    onLogoClick: () => alert('로고 클릭'),
  },
};
