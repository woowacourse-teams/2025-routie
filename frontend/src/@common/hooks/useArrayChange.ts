import { useMemo } from 'react';

import normalize from '@/@common/utils/normalize';

const useArrayChange = (
  initialArray: string[] | undefined,
  currentArray: string[],
) => {
  const stableInitial = useMemo(
    () => initialArray ?? [],
    [initialArray?.join('|')],
  );

  const isChanged = useMemo(() => {
    const a = normalize(currentArray);
    const b = normalize(stableInitial);
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
    return false;
  }, [currentArray, stableInitial]);

  return { isChanged };
};

export default useArrayChange;
