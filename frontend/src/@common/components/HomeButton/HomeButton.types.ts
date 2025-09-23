interface HomeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isHome?: boolean;
  onClick: () => void;
}

export type { HomeButtonProps };
