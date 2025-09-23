interface RoutesType {
  fromSequence: number;
  toSequence: number;
}

interface RoutieType {
  sequence: number;
  placeId: number;
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

interface RoutieAdapterType {
  routiePlaces: RoutieType[];
  routes: RoutesType[];
}

export type { RoutieType, RoutesType, RoutieContextType, RoutieAdapterType };
