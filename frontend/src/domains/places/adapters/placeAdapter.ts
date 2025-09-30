import type {
  FetchPlaceListResponseType,
  FetchPlaceResponseType,
  SearchPlaceResponseType,
} from '@/domains/places/types/api.types';
import type {
  PlaceAdapterType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
} from '@/domains/places/types/place.types';

const getPlaceAdapter = (data: FetchPlaceResponseType): PlaceAdapterType => {
  return {
    name: data.name,
    roadAddressName: data.roadAddressName,
    addressName: data.addressName,
    latitude: data.latitude,
    longitude: data.longitude,
  };
};

const getPlaceListAdapter = (
  data: FetchPlaceListResponseType[],
): PlaceListAdapterType => {
  return data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      roadAddressName: item.roadAddressName,
      addressName: item.addressName,
      latitude: item.latitude,
      longitude: item.longitude,
      likeCount: item.likeCount,
    };
  });
};

const searchPlaceAdapter = (
  data: SearchPlaceResponseType[],
): SearchPlaceAdapterType => {
  return data.map((item) => {
    return {
      searchedPlaceId: item.searchedPlaceId,
      name: item.name,
      roadAddressName: item.roadAddressName,
      addressName: item.addressName,
      latitude: item.latitude,
      longitude: item.longitude,
    };
  });
};

export { getPlaceAdapter, getPlaceListAdapter, searchPlaceAdapter };
