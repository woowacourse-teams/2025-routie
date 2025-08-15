export type MovingStrategyType = 'DRIVING' | 'TRANSIT';

export interface MovingStrategyOption {
  type: MovingStrategyType;
  iconName: 'car' | 'train';
  label: string;
}
