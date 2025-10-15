import PlaceCard from './PlaceCard';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Places/PlaceCard',
  component: PlaceCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlace = {
  id: 1,
  name: '서해갈국수',
  roadAddressName: '충남 예산군 응봉면 응봉로 50-33',
  addressName: '충남 예산군 응봉면 응봉리 50-33',
  latitude: 36.5,
  longitude: 126.8,
  likeCount: 0,
};

export const Default: Story = {
  args: {
    ...mockPlace,
    selected: false,
    liked: false,
    onSelect: async (placeId: number, selected: boolean) => {
      alert(`장소 ${placeId} 선택 ${selected ? '해제' : '추가'}`);
    },
    onDelete: async (placeId: number) => {
      alert(`장소 ${placeId} 삭제`);
    },
    onEdit: (placeId: number) => {
      alert(`장소 ${placeId} 수정`);
    },
    onLike: (placeId: number) => {
      alert(`장소 ${placeId} 좋아요`);
    },
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    selected: true,
  },
};

export const Liked: Story = {
  args: {
    ...Default.args,
    liked: true,
    likeCount: 5,
  },
};

export const SelectedAndLiked: Story = {
  args: {
    ...Default.args,
    selected: true,
    liked: true,
    likeCount: 10,
  },
};

export const LongText: Story = {
  args: {
    ...Default.args,
    name: '아주 긴 장소명을 가진 맛집 이름이 길면 어떻게 표시될까요',
    roadAddressName:
      '서울특별시 강남구 테헤란로 아주 긴 주소명을 가진 경우에는 어떻게 표시될까요',
  },
};
