import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import pinIcon from '@/assets/icons/pin.svg';
import { usePlaceListContext } from '@/domains/places/contexts/PlaceList/PlaceListContext';
import theme from '@/styles/theme';

import { addPlace } from '../../apis/place';
import SearchAddress from '../SearchAddress/SearchAddress';

import type { PlaceAddType } from '../../types/place.types';

interface SearchPlaceProps {
  searchResult: PlaceAddType;
  addressType: '도로명' | '지번';
  address: string;
  onClose: () => void;
}

const SearchPlace = ({
  searchResult,
  addressType,
  address,
  onClose,
}: SearchPlaceProps) => {
  const { runWithLock: runSubmitWithLock } = useAsyncLock();
  const { handlePlaceAdded } = usePlaceListContext();
  const { showToast } = useToastContext();

  const handleSubmit = async () => {
    return runSubmitWithLock(async () => {
      try {
        await addPlace(searchResult);
        await handlePlaceAdded();
        showToast({
          message: '장소가 추가되었습니다.',
          type: 'success',
        });
        onClose();
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
    <Flex justifyContent="space-between" width="100%">
      <Flex gap={1}>
        <img src={pinIcon} alt="pin" />
        <Flex direction="column" alignItems="flex-start" gap={0.5} width="100%">
          <Text variant="caption">{searchResult.name}</Text>
          <SearchAddress addressType={addressType} address={address} />
        </Flex>
      </Flex>
      <Button onClick={() => handleSubmit()} variant="primary" width="20%">
        <Flex width="100%" justifyContent="center">
          <Text variant="caption" color={theme.colors.white}>
            추가하기
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default SearchPlace;
