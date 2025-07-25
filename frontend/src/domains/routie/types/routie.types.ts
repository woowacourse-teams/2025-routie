export type RoutiePlaces = {
  routiePlaces: {
    id: number;
    sequence: number;
    placeId: number;
  }[];
  routes: {
    fromSequence: number;
    toSequence: number;
    movingStrategy: string;
    duration: number;
    distance: number;
  };
};

export type Routes = {
  fromSequence: number;
  toSequence: number;
  movingStrategy: 'DRIVING';
  duration: number;
  distance: number;
};

export type Routie = {
  id: number;
  sequence: number;
  placeId: number;
};

export type RoutiePlace = {
  id: number;
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDays: string[];
};
