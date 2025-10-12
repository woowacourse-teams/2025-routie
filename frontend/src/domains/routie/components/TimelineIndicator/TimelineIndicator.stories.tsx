/** @jsxImportSource @emotion/react */

import TimelineIndicator from './TimelineIndicator';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

/**
 * TimelineIndicator는 동선(루트) 리스트에서 각 장소의 순서를 타임라인 형태로 시각화하는 컴포넌트입니다.
 *
 * ## 주요 특징
 * - 파란 원 안에 순서 번호 표시 (3.2rem × 3.2rem)
 * - 상하로 회색 연결선 표시 (3.6rem 높이)
 * - `isFirst`가 true면 상단 연결선 없음
 * - `isLast`가 true면 하단 연결선 없음
 */
const meta = {
  title: 'Routie/TimelineIndicator',
  component: TimelineIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sequence: {
      description: '표시할 순서 번호',
      control: {
        type: 'number',
        min: 1,
        max: 99,
      },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    isFirst: {
      description: '첫 번째 아이템 여부 (상단 연결선 제거)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLast: {
      description: '마지막 아이템 여부 (하단 연결선 제거)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof TimelineIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 중간 아이템의 기본 상태입니다.
 * 상단과 하단 모두 연결선이 표시됩니다.
 */
export const Default: Story = {
  args: {
    sequence: 2,
    isFirst: false,
    isLast: false,
  },
};

/**
 * 첫 번째 아이템입니다.
 * 상단 연결선이 없고, 하단 연결선만 표시됩니다.
 */
export const FirstItem: Story = {
  args: {
    sequence: 1,
    isFirst: true,
    isLast: false,
  },
};

/**
 * 마지막 아이템입니다.
 * 상단 연결선만 표시되고, 하단 연결선이 없습니다.
 */
export const LastItem: Story = {
  args: {
    sequence: 5,
    isFirst: false,
    isLast: true,
  },
};

/**
 * 단일 아이템입니다.
 * 상단과 하단 연결선이 모두 없습니다.
 * 리스트에 아이템이 하나만 있을 때 사용됩니다.
 */
export const SingleItem: Story = {
  args: {
    sequence: 1,
    isFirst: true,
    isLast: true,
  },
};

/**
 * 두 자릿수 숫자를 표시하는 경우입니다.
 * 원 안에서 숫자가 잘 표시되는지 확인할 수 있습니다.
 */
export const DoubleDigit: Story = {
  args: {
    sequence: 42,
    isFirst: false,
    isLast: false,
  },
};
