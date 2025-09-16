import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { useRoutieSpace } from '../../hooks/useRoutieSpace';

import { RoutieSpaceNameInputStyle } from './RoutieSpaceName.style';

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
  } = useRoutieSpace();

  return (
    <Flex justifyContent="space-between" width="100%" margin={0.4} gap={3}>
      {isEditing ? (
        <input
          ref={inputRef}
          css={RoutieSpaceNameInputStyle(errorCase === 'invalidNameLength')}
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
        padding="0.8rem 0.6rem"
      >
        <Text variant="caption" color={theme.colors.white}>
          {isEditing ? '저장' : '수정'}
        </Text>
      </Button>
    </Flex>
  );
};

export default RoutieSpaceName;
