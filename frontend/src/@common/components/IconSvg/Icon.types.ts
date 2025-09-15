import allIcons from './allIcons';

type IconNameType = keyof typeof allIcons;

interface IconProps {
  name: IconNameType;
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
}

type IconStyleProps = Pick<IconProps, 'onClick' | 'size'>;

export type { IconProps, IconStyleProps };
