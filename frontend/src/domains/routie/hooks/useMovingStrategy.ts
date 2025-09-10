import { useSessionStorage } from '@/@common/hooks/useSessionStorage';

import type { MovingStrategyType } from '../components/SelectMovingStrategy/SelectMovingStrategy.types';

const MOVING_STRATEGY_STORAGE_KEY = 'movingStrategy';

const useMovingStrategy = () => {
  const [movingStrategy, setMovingStrategy] =
    useSessionStorage<MovingStrategyType>(
      MOVING_STRATEGY_STORAGE_KEY,
      'DRIVING',
    );

  return {
    movingStrategy,
    setMovingStrategy,
  };
};

export { useMovingStrategy };
