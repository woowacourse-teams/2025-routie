import RoutieSpaceListItem from './RoutieSpaceListItem';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'ManageRoutieSpaces/RoutieSpaceListItem',
  component: RoutieSpaceListItem,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ul style={{ width: '400px', listStyle: 'none', padding: 0 }}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof RoutieSpaceListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: '서울 여행 루티',
    date: new Date('2025-10-10T14:30:00'),
    routieSpaceUuid: 'uuid-1234',
    onClickRoutieSpace: (uuid) => alert(`수정 클릭: ${uuid}`),
    onDeleteRoutieSpace: (uuid) => alert(`삭제 클릭: ${uuid}`),
  },
};
