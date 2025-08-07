export type PlaceSearchType = PlaceLocationType & {
  name: string;
  roadAddressName: string;
};

export type PlaceLocationType = {
  searchedPlaceId: string;
  longitude: number;
  latitude: number;
};

export type PlaceBaseType = {
  name: string;
  roadAddressName: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDayOfWeeks: string[];
  longitude: number;
  latitude: number;
};

export type PlaceCreateType = PlaceBaseType & {
  searchedPlaceId: string;
};

export type PlaceListType = Omit<
  PlaceBaseType,
  'breakStartAt' | 'breakEndAt' | 'stayDurationMinutes'
> & {
  id: number;
};
