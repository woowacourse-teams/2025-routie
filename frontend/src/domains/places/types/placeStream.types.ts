import { FetchPlaceListResponseType } from './api.types';

interface PlaceHistoryEvent {
  places: FetchPlaceListResponseType[];
}
interface PlaceCratedEvent {
  createdPlaceId: number;
  places: FetchPlaceListResponseType[];
}
interface PlaceUpdatedEvent {
  updatedPlaceId: number;
  places: FetchPlaceListResponseType[];
}

interface PlaceDeletedEvent {
  deletedPlaceId: number;
  places: FetchPlaceListResponseType[];
}

export {
  PlaceHistoryEvent,
  PlaceCratedEvent,
  PlaceUpdatedEvent,
  PlaceDeletedEvent,
};
