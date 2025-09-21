const placesKeys = {
  all: ['places'] as const,
  list: () => [...placesKeys.all, 'list'] as const,
  detail: (placeId: number) => [...placesKeys.all, 'detail', placeId] as const,
  search: (query: string) => [...placesKeys.all, 'search', query] as const,
};

export { placesKeys };
