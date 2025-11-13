import { useEffect } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { getAccessToken } from '@/@common/utils/getAccessToken';
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
  const accessToken = getAccessToken();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (name) {
      const params = new URLSearchParams(window.location.search);
      params.set('name', name);

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [name]);

  return (
    <Flex justifyContent="space-between" gap={3} padding="0 1rem">
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
        <Flex justifyContent="flex-start" maxWidth="41rem" padding={0.4}>
          <Text variant="subTitle">{name}</Text>
        </Flex>
      )}
      {accessToken && role === 'USER' && (
        <Button
          variant="primary"
          onClick={handleClick}
          width="5rem"
          disabled={isLoading}
          padding="0.6rem 0.8rem"
        >
          <Text variant="label" color={theme.colors.white}>
            {isEditing ? '저장' : '수정'}
          </Text>
        </Button>
      )}
    </Flex>
  );
};

export default RoutieSpaceName;
