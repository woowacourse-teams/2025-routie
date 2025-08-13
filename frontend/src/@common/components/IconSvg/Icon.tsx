import { css as emotionCss } from '@emotion/react';

import { IconProps } from './Icon.types';
import allIcons from './allIcons';

const Icon = ({ name, size = 14, onClick, className }: IconProps) => {
  const src = allIcons[name];
  if (!src) {
    console.error(`등록되지 않은 아이콘: ${name}`);
    return null;
  }

  return (
    <img
      src={src}
      alt={name}
      onClick={onClick}
      className={className}
      css={iconStyle({ name, size, onClick })}
    />
  );
};

export default Icon;

export const iconStyle = (props: IconProps) => emotionCss`
  cursor: ${props.onClick ? 'pointer' : 'default'};
  flex-shrink: 0;
  width: ${props.size || 24}px;
  height: ${props.size || 24}px;
`;
