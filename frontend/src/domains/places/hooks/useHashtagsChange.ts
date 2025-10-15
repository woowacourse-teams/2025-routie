import { useMemo } from 'react';

const normalize = (arr?: string[]) =>
  Array.from(new Set((arr ?? []).map((s) => s.trim()))).sort();

const useHashtagsChange = (
  initialHashtags: string[] | undefined,
  selectedTags: string[],
) => {
  const stableInitial = useMemo(
    () => initialHashtags ?? [],
    [initialHashtags?.join('|')],
  );

  const isHashtagsChanged = useMemo(() => {
    const a = normalize(selectedTags);
    const b = normalize(stableInitial);
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
    return false;
  }, [selectedTags, stableInitial]);

  return { isHashtagsChanged };
};

export default useHashtagsChange;
