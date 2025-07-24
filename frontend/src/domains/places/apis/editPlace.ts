import { apiClient } from '@/apis';

import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

type editPlaceParam = {
  placeId: number;
  editableFields: Omit<FormState, 'name' | 'address'>;
};

const editPlace = async ({ placeId, editableFields }: editPlaceParam) => {
  const response = await apiClient.patch(`/places/${placeId}`, editableFields);

  if (!response.ok) {
    throw new Error(`${placeId}: 장소 수정하기에 실패하였습니다.`);
  }
};

export default editPlace;
