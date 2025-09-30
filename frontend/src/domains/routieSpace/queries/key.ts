const routieSpaceKeys = {
  all: ['routieSpace'] as const,
  edit: (name: string) => [...routieSpaceKeys.all, name] as const,
  list: () => [...routieSpaceKeys.all, 'list'] as const,
};

export { routieSpaceKeys };
