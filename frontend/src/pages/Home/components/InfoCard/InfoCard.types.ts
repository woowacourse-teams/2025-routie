import type { IconNameType } from '@/@common/components/IconSvg/Icon.types';

interface InfoCardProps {
  circleColor: string;
  iconName: IconNameType;
  iconAlt?: string;
  title: string;
  descriptions: string[];
  size?: string;
  textColor?: string;
}

export type { InfoCardProps };
