interface RoutesType {
  fromSequence: number;
  toSequence: number;
  duration: number;
  distance: number;
}

interface RoutieType {
  id: number;
  sequence: number;
  placeId: number;
  arriveDateTime?: string;
  departureDateTime?: string;
}

interface RoutieContextType {
  routiePlaces: RoutieType[];
  routes: RoutesType[];
  refetchRoutieData: () => Promise<void>;
  handleAddRoutie: (id: number) => Promise<void>;
  handleDeleteRoutie: (id: number) => Promise<void>;
  handleChangeRoutie: (sortedPlaces: RoutieType[]) => Promise<void>;
  routieIdList: number[];
}

export type { RoutieType, RoutesType, RoutieContextType };
