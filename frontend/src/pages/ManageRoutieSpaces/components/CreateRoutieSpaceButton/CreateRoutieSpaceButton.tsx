/** @jsxImportSource @emotion/react */

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

import {
  ButtonContentContainerStyle,
  ButtonIconSectionStyle,
  CreateRoutieSpaceButtonStyle,
} from './CreateRoutieSpaceButton.styles';

import type { CreateRoutieSpaceButtonProps } from './CreateRoutieSpaceButton.types';

const CreateRoutieSpaceButton = ({ onClick }: CreateRoutieSpaceButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      css={CreateRoutieSpaceButtonStyle}
    >
      <Flex
        direction="column"
        gap={1.5}
        padding={1}
        height="22rem"
        css={ButtonContentContainerStyle}
      >
        <Icon name="plusRound" size={80} css={ButtonIconSectionStyle} />
        <Text variant="subTitle" color="white">
          새 동선 만들기
        </Text>
      </Flex>
    </Button>
  );
};

export default CreateRoutieSpaceButton;
