import { IconButtonStyle } from './IconButton.style';

import type { IconButtonProps } from './IconButton.types';

const IconButton = ({ icon, onClick, variant, ...props }: IconButtonProps) => {
  return (
    <button onClick={onClick} css={IconButtonStyle({ variant })} {...props}>
      <img src={icon} />
    </button>
  );
};

export default IconButton;
