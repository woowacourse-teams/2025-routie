import LikeButton from './LikeButton';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Places/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 10,
    onClick: () => alert('좋아요 클릭!'),
  },
};
