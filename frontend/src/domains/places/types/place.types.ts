export type PlaceBase = {
  id: number;
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDayOfWeeks: string[];
};

export type PlaceSearchType = PlaceLocationType & {
  placeName: string;
  roadAddressName: string;
};

export type PlaceLocationType = {
  id: string;
  longitude: number;
  latitude: number;
};
