import type { FetchRoutieResponseType } from '../types/api.types';
import type { RoutieAdapterType } from '../types/routie.types';

const routieAdapter = (data: FetchRoutieResponseType): RoutieAdapterType => {
  return {
    routiePlaces: data.routiePlaces.map((routie) => {
      return {
        id: routie.id,
        sequence: routie.sequence,
        placeId: routie.placeId,
      };
    }),
    routes: data.routes.map((route) => {
      return {
        fromSequence: route.fromSequence,
        toSequence: route.toSequence,
      };
    }),
  };
};

export { routieAdapter };
