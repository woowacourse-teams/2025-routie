import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';

import {
  backgroundSliderStyle,
  containerStyle,
  movingStrategyIconWrapperStyle,
} from './SelectMovingStrategy.styles';

import type {
  MovingStrategyOption,
  MovingStrategyType,
} from './SelectMovingStrategy.types';

const MOVING_STRATEGY_OPTIONS: MovingStrategyOption[] = [
  { type: 'DRIVING', iconName: 'car', label: '자동차' },
  { type: 'TRANSIT', iconName: 'train', label: '대중교통' },
];

const SelectMovingStrategy = () => {
  const [movingStrategy, setMovingStrategy] =
    useState<MovingStrategyType>('DRIVING');

  const selectedIndex = MOVING_STRATEGY_OPTIONS.findIndex(
    (option) => option.type === movingStrategy,
  );

  return (
    <Flex
      css={containerStyle}
      width="100%"
      justifyContent="space-around"
      role="radiogroup"
      aria-label="이동 수단 선택"
    >
      <div
        css={backgroundSliderStyle(
          selectedIndex,
          MOVING_STRATEGY_OPTIONS.length,
        )}
      />
      {MOVING_STRATEGY_OPTIONS.map((option) => (
        <Flex
          key={option.type}
          css={movingStrategyIconWrapperStyle}
          role="radio"
          aria-checked={movingStrategy === option.type}
          aria-label={option.label}
        >
          <Icon
            name={option.iconName}
            size={32}
            onClick={() => setMovingStrategy(option.type)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default SelectMovingStrategy;
