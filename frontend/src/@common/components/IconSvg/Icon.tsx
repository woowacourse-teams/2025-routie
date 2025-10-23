/** @jsxImportSource @emotion/react */
import { IconStyle } from './Icon.styles';
import allIcons from './allIcons';

import type { IconProps } from './Icon.types';

const Icon = ({
  name,
  size = 14,
  height,
  alt,
  onClick,
  className,
}: IconProps) => {
  const src = allIcons[name];
  if (!src) {
    console.error(`등록되지 않은 아이콘: ${name}`);
    return null;
  }

  return (
    <img
      src={src}
      alt={alt ?? name}
      onClick={onClick}
      className={className}
      css={IconStyle({ size, onClick, height })}
    />
  );
};

export default Icon;
