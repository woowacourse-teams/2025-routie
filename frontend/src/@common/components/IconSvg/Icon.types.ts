import allIcons from './allIcons';

type IconNameType = keyof typeof allIcons;

interface IconProps {
  name: IconNameType;
  size?: number;
  height?: number;
  alt?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

type IconStyleProps = Pick<IconProps, 'onClick' | 'size' | 'height'>;

export type { IconNameType, IconProps, IconStyleProps };
