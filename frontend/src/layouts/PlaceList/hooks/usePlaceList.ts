import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';
import { editRoutieSequence } from '@/domains/routie/apis/routie';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';
import { Routie } from '@/domains/routie/types/routie.types';
import {
  addRoutiePlace,
  deleteRoutiePlace,
} from '@/layouts/PlaceList/utils/routiePlaceHandler';

export const usePlaceList = ({
  places,
  onDelete,
  onPlaceChange,
  routiePlaces,
  setRoutiePlaces,
  onRoutieDataChange,
}: {
  places: PlaceCardProps[];
  onDelete: (id: number) => void;
  onPlaceChange: () => Promise<void>;
  routiePlaces: Routie[];
  setRoutiePlaces: React.Dispatch<React.SetStateAction<Routie[] | undefined>>;
  onRoutieDataChange?: () => Promise<void>;
}) => {
  const { validateRoutie } = useRoutieValidateContext();

  return places.map((place: PlaceCardProps) => {
    const selected = routiePlaces.some(
      (routiePlace) => routiePlace.placeId === place.id,
    );

    const onSelect = async () => {
      const updatedRoutiePlaces = selected
        ? deleteRoutiePlace(place.id, routiePlaces)
        : addRoutiePlace(place.id, routiePlaces);

      try {
        await editRoutieSequence(updatedRoutiePlaces);
        setRoutiePlaces(updatedRoutiePlaces);
        if (onRoutieDataChange) await onRoutieDataChange();
        await validateRoutie();
      } catch (error) {
        console.error('루티 업데이트 실패:', error);
      }
    };

    return {
      ...place,
      selected,
      onSelect,
      onDelete,
      onPlaceChange,
    };
  });
};
