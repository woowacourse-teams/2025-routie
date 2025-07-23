import { iconButtonStyle } from './IconButton.style';
import { IconButtonProps } from './IconButton.types';

const IconButton = ({ icon, onClick, variant, ...props }: IconButtonProps) => {
  return (
    <button onClick={onClick} css={iconButtonStyle({ variant })} {...props}>
      <img src={icon} />
    </button>
  );
};

export default IconButton;
