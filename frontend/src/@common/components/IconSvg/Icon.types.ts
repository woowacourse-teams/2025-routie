import allIcons from './allIcons';

type IconName = keyof typeof allIcons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
}

type IconStyleProps = Pick<IconProps, 'onClick' | 'size'>;

export type { IconProps, IconStyleProps };
