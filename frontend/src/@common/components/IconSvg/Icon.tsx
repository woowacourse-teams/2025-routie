import { IconStyle } from './Icon.styles';
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
      css={IconStyle({ size, onClick })}
    />
  );
};

export default Icon;
