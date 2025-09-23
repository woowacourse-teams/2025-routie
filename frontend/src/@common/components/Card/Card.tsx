import { CardStyle } from './Card.styles';

import type { CardProps } from './Card.types';

const Card = ({ id, children, width, height, variant }: CardProps) => {
  return (
    <div id={id} css={CardStyle({ variant, width, height })}>
      {children}
    </div>
  );
};

export default Card;
