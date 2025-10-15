import { IconNameType } from '@/@common/components/IconSvg/Icon.types';

interface TabButtonProps {
  name: string;
  icon: IconNameType;
  onClick: () => void;
  isActive: boolean;
}

export type { TabButtonProps };
