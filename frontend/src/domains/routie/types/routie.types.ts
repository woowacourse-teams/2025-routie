interface RoutesType {
  fromSequence: number;
  toSequence: number;
}

interface RoutieType {
  id: number;
  sequence: number;
  placeId: number;
}

interface RoutieAdapterType {
  routiePlaces: RoutieType[];
  routes: RoutesType[];
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

export type { RoutieType, RoutesType, RoutieContextType, RoutieAdapterType };
