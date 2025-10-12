import TabButton from './TabButton';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'RoutieSpace/TabButton',
  component: TabButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof TabButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    name: '장소',
    icon: 'placeTabSelect',
    isActive: true,
    onClick: () => {},
  },
};

export const Inactive: Story = {
  args: {
    name: '장소',
    icon: 'placeTab',
    isActive: false,
    onClick: () => {},
  },
};

export const ActiveRoute: Story = {
  args: {
    name: '경로',
    icon: 'routeTabSelect',
    isActive: true,
    onClick: () => {},
  },
};

export const InactiveRoute: Story = {
  args: {
    name: '경로',
    icon: 'routeTab',
    isActive: false,
    onClick: () => {},
  },
};

export const Share: Story = {
  args: {
    name: '링크 공유',
    icon: 'share',
    isActive: false,
    onClick: () => {},
  },
};
