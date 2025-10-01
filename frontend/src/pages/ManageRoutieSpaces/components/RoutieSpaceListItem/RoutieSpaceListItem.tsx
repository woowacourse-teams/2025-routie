import { memo, useCallback } from 'react';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';
import theme from '@/styles/theme';

import { RoutieSpaceListItemStyle } from './RoutieSpaceListItem.styles';

import type { RoutieSpaceListItemProps } from './RoutieSpaceListItem.types';

const RoutieSpaceListItem = ({
  name,
  date,
  routieSpaceUuid,
  onClickRoutieSpace,
  onDeleteRoutieSpace,
}: RoutieSpaceListItemProps) => {
  const handleClick = useCallback(() => {
    onClickRoutieSpace(routieSpaceUuid);
  }, [onClickRoutieSpace, routieSpaceUuid]);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDeleteRoutieSpace(routieSpaceUuid);
    },
    [onDeleteRoutieSpace, routieSpaceUuid],
  );

  return (
    <li css={RoutieSpaceListItemStyle} onClick={handleClick}>
      <Flex flex={1} direction="column" alignItems="flex-start" gap={0.5}>
        <Text variant="subTitle">이름: {name}</Text>
        <Text variant="caption">
          생성 날짜:{' '}
          {date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Flex>
      <Button
        width="5rem"
        onClick={handleDelete}
        css={css`
          &:hover {
            background-color: ${theme.colors.red[50]};
          }
        `}
      >
        <Text variant="body">삭제</Text>
      </Button>
    </li>
  );
};

export default memo(RoutieSpaceListItem);
