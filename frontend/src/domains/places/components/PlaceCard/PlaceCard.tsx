import { css } from '@emotion/react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import { usePlaceListContext } from '@/domains/places/contexts/PlaceList/PlaceListContext';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import { deletePlace } from '../../apis/place';

import type { PlaceCardProps } from './PlaceCard.types';

const PlaceCard = ({ selected, ...props }: PlaceCardProps) => {
  const { refetchPlaceList } = usePlaceListContext();
  const { handleAddRoutie } = useRoutieContext();
  const { triggerEvent } = useGoogleEventTrigger();
  const { showToast } = useToastContext();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();

  const handlePlaceSelect = async () => {
    if (selected) return;

    try {
      await handleAddRoutie(props.id);
      triggerEvent({
        action: 'click',
        category: 'routie',
        label: '루티에 장소 추가하기 버튼',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    return runDeleteWithLock(async () => {
      try {
        await deletePlace(props.id);
        await refetchPlaceList();
        triggerEvent({
          action: 'click',
          category: 'place',
          label: '장소 삭제하기 버튼',
        });
        showToast({
          message: '장소가 삭제되었습니다.',
          type: 'success',
        });
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
      }
    });
  };

  return (
    <>
      <Card
        id={props.id.toString()}
        variant={selected ? 'available' : 'default'}
      >
        <Flex
          direction="column"
          gap={1.6}
          justifyContent="flex-start"
          alignItems="flex-start"
          height="8rem"
          css={css`
            padding: 0.8rem 0.4rem;
          `}
        >
          <Flex
            justifyContent="space-between"
            width="100%"
            height="100%"
            gap={2}
          >
            <Flex
              direction="column"
              alignItems="flex-start"
              gap={1}
              css={css`
                flex: 1;
                min-width: 0;
              `}
            >
              <Text variant="subTitle" ellipsis>
                {props.name}
              </Text>
              <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
                {props.roadAddressName || props.addressName}
              </Text>
            </Flex>
            <Flex direction="column" gap={1.6} height="100%">
              <Icon
                name={selected ? 'check' : 'plus'}
                onClick={handlePlaceSelect}
                size={selected ? 34 : 30}
                css={css`
                  cursor: ${selected ? 'default' : 'pointer'};
                  padding: 0.2rem;
                  border-radius: 8px;

                  &:hover {
                    background-color: ${selected
                      ? theme.colors.white
                      : theme.colors.purple[200]};
                  }
                `}
              />

              <Icon
                name={selected ? 'disableTrash' : 'trash'}
                onClick={selected ? undefined : handleDelete}
                size={30}
                css={css`
                  cursor: ${selected ? 'default' : 'pointer'};
                  padding: 0.4rem;
                  border-radius: 8px;

                  &:hover {
                    background-color: ${selected
                      ? theme.colors.white
                      : theme.colors.red[50]};
                  }
                `}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default PlaceCard;
