interface LikeButtonProps {
  count: number;
  liked: boolean;
  onClick: () => void | Promise<void>;
}

export type { LikeButtonProps };
