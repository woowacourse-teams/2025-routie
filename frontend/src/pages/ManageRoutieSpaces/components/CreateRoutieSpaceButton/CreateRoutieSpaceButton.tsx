/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

import type { CreateRoutieSpaceButtonProps } from './CreateRoutieSpaceButton.types';

const CreateRoutieSpaceButton = ({ onClick }: CreateRoutieSpaceButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      css={css`
        max-width: 25rem;

        @media (width <= 540px) {
          max-width: 100%;
        }
      `}
    >
      <Flex
        direction="column"
        gap={1.5}
        padding={1}
        height="22rem"
        css={css`
          @media (width <= 540px) {
            flex-direction: row;
            gap: 1rem;
            width: 100%;
            height: auto;
          }
        `}
      >
        <Icon
          name="plusRound"
          size={80}
          css={css`
            @media (width <= 540px) {
              width: 40px;
              height: 40px;
            }
          `}
        />
        <Text variant="subTitle" color="white">
          새 동선 만들기
        </Text>
      </Flex>
    </Button>
  );
};

export default CreateRoutieSpaceButton;
