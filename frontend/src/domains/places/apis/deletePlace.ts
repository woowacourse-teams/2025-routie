import { apiClient } from '@/apis';

const deletePlace = async (id: number) => {
  const response = await apiClient.delete(`/places/${id}`);

  if (!response.ok) {
    throw new Error('장소 삭제 실패');
  }
};

export default deletePlace;
