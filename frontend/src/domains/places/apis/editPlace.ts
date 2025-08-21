import { apiClient } from '@/apis';

import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

type editPlaceParam = {
  placeId: number;
  editableFields: Omit<FormState, 'name' | 'roadAddressName' | 'addressName'>;
};

const editPlace = async ({ placeId, editableFields }: editPlaceParam) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.patch(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
    editableFields,
  );
};

export default editPlace;
