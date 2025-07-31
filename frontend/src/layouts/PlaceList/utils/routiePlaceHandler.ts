import { Routie } from '@/domains/routie/types/routie.types';

export const addRoutiePlace = (placeId: number, routiePlaces: Routie[]) => [
  ...routiePlaces,
  { id: placeId, placeId, sequence: routiePlaces.length + 1 },
];

export const deleteRoutiePlace = (placeId: number, routiePlaces: Routie[]) =>
  routiePlaces
    .filter((routiePlace) => routiePlace.placeId !== placeId)
    .map((routiePlace, index) => ({
      ...routiePlace,
      sequence: index + 1,
    }));
