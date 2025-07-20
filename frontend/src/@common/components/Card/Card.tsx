import { ComponentProps } from 'react';

import CardStyle from './Card.styles';

interface CardProps extends ComponentProps<'div'> {
  id: string;
  variant?: 'default' | 'available' | 'unavailable' | 'disabled';
  children?: React.ReactNode;
}

const Card = ({ id, variant = 'default', children }: CardProps) => {
  return (
    <div id={id} css={CardStyle(variant)}>
      {children}
    </div>
  );
};

export default Card;
