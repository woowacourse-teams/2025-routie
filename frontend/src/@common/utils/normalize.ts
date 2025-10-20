const normalize = (arr?: string[]) =>
  Array.from(new Set((arr ?? []).map((s) => s.trim()))).sort();

export { normalize };
