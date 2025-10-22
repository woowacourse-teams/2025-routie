import type { FetchRoutieResponseType } from '@/domains/routie/types/api.types';
import type { RoutieAdapterType } from '@/domains/routie/types/routie.types';

const routieAdapter = (data: FetchRoutieResponseType): RoutieAdapterType => {
  return {
    routiePlaces: data.routiePlaces.map((routie) => {
      return {
        sequence: routie.sequence,
        placeId: routie.placeId,
      };
    }),
  };
};

export { routieAdapter };
