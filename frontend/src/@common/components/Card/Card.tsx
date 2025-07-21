import CardStyle from './Card.styles';
import { CardProps } from './Card.types';

const Card = ({ id, variant = 'default', children }: CardProps) => {
  return (
    <div id={id} css={CardStyle(variant)}>
      {children}
    </div>
  );
};

export default Card;
