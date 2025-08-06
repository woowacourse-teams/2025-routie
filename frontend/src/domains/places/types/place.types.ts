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

export type PlaceSearchType = {
  id: string;
  placeName: string;
  roadAddressName: string;
  longitude: number;
  latitude: number;
};
