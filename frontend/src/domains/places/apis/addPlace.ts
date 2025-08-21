import { apiClient } from '@/apis';

import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

const addPlace = async (placeInfo: FormState) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.post(
    `/routie-spaces/${routieSpaceUuid}/places`,
    placeInfo,
  );

  const data = await response.json();

  return data;
};

export default addPlace;
