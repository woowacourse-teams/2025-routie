interface HomeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  isHome?: boolean;
  onClick: () => void;
}

export type { HomeButtonProps };
