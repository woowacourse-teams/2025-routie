import { FetchRoutieResponseType } from './api.types';

type RoutieHistoryEvent = FetchRoutieResponseType;

interface RoutieCreatedEvent extends FetchRoutieResponseType {
  createdRoutiePlaceId: number;
}
type RoutieUpdatedEvent = FetchRoutieResponseType;

interface RoutieDeletedEvent extends FetchRoutieResponseType {
  deletedRoutiePlaceId: number;
}

export type {
  RoutieHistoryEvent,
  RoutieCreatedEvent,
  RoutieUpdatedEvent,
  RoutieDeletedEvent,
};
