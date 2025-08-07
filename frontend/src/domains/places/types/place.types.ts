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
