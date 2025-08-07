import { apiClient } from '@/apis';

import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

type editPlaceParam = {
  placeId: number;
  editableFields: Omit<FormState, 'name' | 'roadAddressName'>;
};

const editPlace = async ({ placeId, editableFields }: editPlaceParam) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.patch(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
    editableFields,
  );

  if (!response.ok) {
    throw new Error(`${placeId}: 장소 수정하기에 실패하였습니다.`);
  }
};

export default editPlace;
