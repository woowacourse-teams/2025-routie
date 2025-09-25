/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import Flex from './Flex';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'common/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Flex 컴포넌트는 Flexbox 레이아웃을 구현하기 위한 컴포넌트입니다. 다양한 방향과 정렬 옵션을 지원합니다.',
      },
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 5,
    height: '50rem',
    width: '50rem',
    children: 'Flex 컴포넌트 입니다.',
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
    },
    justifyContent: {
      control: { type: 'select' },
      options: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
        'center',
        'initial',
        'inherit',
      ],
    },
    alignItems: {
      control: { type: 'select' },
      options: [
        'normal',
        'flex-start',
        'flex-end',
        'start',
        'center',
        'end',
        'baseline',
        'stretch',
        'initial',
        'inherit',
      ],
    },
    margin: {
      control: false,
    },
    padding: {
      control: false,
    },
    width: {
      control: false,
    },
    height: {
      control: false,
    },
    gap: {
      control: { type: 'number' },
    },
    children: {
      control: false,
    },
  },
  render: (args) => {
    return (
      <Flex {...args}>
        <Flex
          width="3.2rem"
          height="3.2rem"
          css={css`
            background-color: green;
          `}
        >
          1
        </Flex>
        <Flex
          width="3.2rem"
          height="3.2rem"
          css={css`
            background-color: red;
          `}
        >
          2
        </Flex>
        <Flex
          width="3.2rem"
          height="3.2rem"
          css={css`
            background-color: blue;
          `}
        >
          3
        </Flex>
      </Flex>
    );
  },
};
