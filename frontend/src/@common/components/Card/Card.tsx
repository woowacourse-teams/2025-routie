import { CardStyle } from './Card.styles';

import type { CardProps } from './Card.types';

const Card = ({
  id,
  width,
  height,
  variant = 'default',
  children,
}: CardProps) => {
  return (
    <div id={id} css={CardStyle(variant, width, height)}>
      {children}
    </div>
  );
};

export default Card;
