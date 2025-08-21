import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

import { useRoutieContext } from '../../contexts/useRoutieContext';

import {
  backgroundSliderStyle,
  containerStyle,
  movingStrategyIconWrapperStyle,
  movingStrategyIconStyle,
} from './SelectMovingStrategy.styles';

import type {
  MovingStrategyOption,
} from './SelectMovingStrategy.types';

const MOVING_STRATEGY_OPTIONS: MovingStrategyOption[] = [
  { type: 'DRIVING', iconName: 'car', label: '자동차' },
  { type: 'TRANSIT', iconName: 'train', label: '대중교통' },
];

const SelectMovingStrategy = () => {
  const { movingStrategy, setMovingStrategy } = useRoutieContext();

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
          height="4rem"
          gap={0.5}
          onClick={() => setMovingStrategy(option.type)}
        >
          <Icon
            name={option.iconName}
            size={24}
            css={movingStrategyIconStyle}
          />
          <Text variant="caption">{option.label}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default SelectMovingStrategy;
