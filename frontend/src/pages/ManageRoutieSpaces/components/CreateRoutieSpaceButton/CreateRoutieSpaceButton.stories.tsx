import CreateRoutieSpaceButton from './CreateRoutieSpaceButton';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'ManageRoutieSpaces/CreateRoutieSpaceButton',
  component: CreateRoutieSpaceButton,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ul style={{ width: '400px', listStyle: 'none', padding: 0 }}>
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
} satisfies Meta<typeof CreateRoutieSpaceButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => alert('새 동선 만들기 클릭!'),
  },
};