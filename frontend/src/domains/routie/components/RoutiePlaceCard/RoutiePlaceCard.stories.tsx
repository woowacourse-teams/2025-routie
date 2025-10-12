import RoutiePlaceCard from './RoutiePlaceCard';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

/**
 * RoutiePlaceCard 컴포넌트
 *
 * 루티(Routie) 동선에 포함된 장소를 표시하는 카드 컴포넌트입니다.
 *
 * ## 주요 기능
 * - 장소명과 주소 정보 표시 (긴 텍스트는 ellipsis 처리)
 * - 케밥 메뉴(⋮)를 통한 옵션 메뉴 제공
 * - "동선에서 삭제" 기능
 * - 드래그 핸들로 순서 변경 가능 (아이콘만 표시)
 * - 외부 클릭 시 메뉴 자동 닫힘
 *
 * ## 접근성
 * - 케밥 버튼에 aria-label과 aria-expanded 속성 포함
 * - 삭제 버튼에 aria-label 속성 포함
 */
const meta = {
  title: 'Routie/RoutiePlaceCard',
  component: RoutiePlaceCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '루티 동선에 추가된 장소를 표시하는 카드 컴포넌트입니다. 드래그로 순서를 변경하거나 케밥 메뉴를 통해 삭제할 수 있습니다.',
      },
    },
  },
  argTypes: {
    place: {
      description: '장소 정보 객체',
      control: false,
      table: {
        type: {
          summary: 'PlaceDataType',
          detail: `{
  id: number;
  name: string;
  roadAddressName: string | null;
  addressName: string;
  latitude: number;
  longitude: number;
}`,
        },
      },
    },
    onDelete: {
      description: '삭제 버튼 클릭 시 호출되는 콜백 함수',
      action: 'deleted',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RoutiePlaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 기본 RoutiePlaceCard 스토리
 *
 * 도로명 주소와 지번 주소가 모두 있는 일반적인 케이스입니다.
 */
export const Default: Story = {
  args: {
    place: {
      id: 1,
      name: '서현역광장',
      roadAddressName: '경기 성남시 분당구 서현동 269-7',
      addressName: '경기 성남시 분당구 서현동 269-7',
      latitude: 37.385635,
      longitude: 127.121855,
    },
    onDelete: () => alert('Deleted: 서현역광장'),
  },
  parameters: {
    docs: {
      description: {
        story:
          '가장 일반적인 형태의 장소 카드입니다. 장소명, 주소, 케밥 메뉴, 드래그 핸들이 표시됩니다.',
      },
    },
  },
};
