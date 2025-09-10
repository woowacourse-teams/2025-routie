import type { RoutieType } from '@/domains/routie/types/routie.types';

const addRoutiePlace = (placeId: number, routiePlaces: RoutieType[]) => [
  ...routiePlaces,
  { id: placeId, placeId, sequence: routiePlaces.length + 1 },
];

const deleteRoutiePlace = (placeId: number, routiePlaces: RoutieType[]) =>
  routiePlaces
    .filter((routiePlace) => routiePlace.placeId !== placeId)
    .map((routiePlace, index) => ({
      ...routiePlace,
      sequence: index + 1,
    }));

export { addRoutiePlace, deleteRoutiePlace };
