import allIcons from './allIcons';

type IconNameType = keyof typeof allIcons;

interface IconProps {
  name: IconNameType;
  size?: number;
  alt?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

type IconStyleProps = Pick<IconProps, 'onClick' | 'size'>;

export type { IconNameType, IconProps, IconStyleProps };
