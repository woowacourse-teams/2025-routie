const routieSpaceKeys = {
  all: ['routieSpace'] as const,
  edit: (name: string) => [...routieSpaceKeys.all, name] as const,
};

export { routieSpaceKeys };
