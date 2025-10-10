import { PropsWithChildren } from 'react';

interface HeaderProps extends PropsWithChildren {
  onLogoClick: () => void;
}

export type { HeaderProps };
