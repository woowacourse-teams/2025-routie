import { apiClient } from '@/apis';

const deletePlace = async (id: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.delete(
    `/routie-spaces/${routieSpaceUuid}/places/${id}`,
  );

  if (!response.ok) {
    throw new Error('장소 삭제 실패');
  }
};

export default deletePlace;
