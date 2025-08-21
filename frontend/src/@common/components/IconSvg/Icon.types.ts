import allIcons from './allIcons';

type IconName = keyof typeof allIcons;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
}
