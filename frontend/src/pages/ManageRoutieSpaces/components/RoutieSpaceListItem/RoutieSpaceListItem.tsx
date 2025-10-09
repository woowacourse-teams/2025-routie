import { memo, useCallback } from 'react';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
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
    <li css={RoutieSpaceListItemStyle}>
      <Flex flex={1} direction="column" gap={0.5}>
        <Flex
          direction="column"
          gap={0.5}
          alignItems="flex-start"
          margin="0 0 12rem 0"
        >
          <Text variant="subTitle">{name}</Text>
          <Text variant="caption">
            {date.toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Flex>
        <Flex gap={1}>
          <Button
            variant="primary"
            width="50%"
            radius="sm"
            padding="0.8rem 0.6rem"
            onClick={handleClick}
          >
            <Text variant="caption" color={theme.colors.white}>
              수정
            </Text>
          </Button>
          <Button
            variant="dangerSecondary"
            width="50%"
            padding="0.8rem 0.6rem"
            onClick={handleDelete}
          >
            <Text variant="caption" color={theme.colors.white}>
              삭제
            </Text>
          </Button>
        </Flex>
      </Flex>
    </li>
  );
};

export default memo(RoutieSpaceListItem);
