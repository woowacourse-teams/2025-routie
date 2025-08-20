import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import useRoutieSpaceName from '../../hooks/useRoutieSpaceName';

import routieSpaceNameInputStyle from './RoutieSpaceName.style';

const RoutieSpaceName = () => {
  const {
    name,
    isEditing,
    isLoading,
    errorCase,
    inputRef,
    handleEnter,
    handleClick,
    handleChange,
  } = useRoutieSpaceName();

  return (
    <Flex justifyContent="space-between" width="100%" margin={0.4} gap={3}>
      {isEditing ? (
        <input
          ref={inputRef}
          css={routieSpaceNameInputStyle(errorCase === 'invalidNameLength')}
          autoFocus
          value={name}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
      ) : (
        <Flex justifyContent="flex-start" padding={0.4} width="100%">
          <Text variant="title2">{name}</Text>
        </Flex>
      )}
      <Button
        variant="primary"
        onClick={handleClick}
        width="5rem"
        disabled={isLoading}
        css={css`
          padding: 0.8rem 0.6rem;
        `}
      >
        <Flex width="100%">
          <Text variant="caption" color={theme.colors.white}>
            {isEditing ? '저장' : '수정'}
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default RoutieSpaceName;
