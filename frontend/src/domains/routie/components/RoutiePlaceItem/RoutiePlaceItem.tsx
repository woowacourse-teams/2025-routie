/** @jsxImportSource @emotion/react */
import { memo } from 'react';

import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import TimelineIndicator from '@/domains/routie/components/TimelineIndicator/TimelineIndicator';

import { PlaceItemContainerStyle } from './RoutiePlaceItem.styles';

import type { RoutiePlaceItemProps } from './RoutiePlaceItem.types';

const RoutiePlaceItem = ({
  routie,
  place,
  index,
  isFirst,
  isLast,
  onDelete,
  getDragProps,
}: RoutiePlaceItemProps) => {
  return (
    <div {...getDragProps(index)} css={PlaceItemContainerStyle}>
      <TimelineIndicator
        sequence={routie.sequence}
        isFirst={isFirst}
        isLast={isLast}
      />

      <RoutiePlaceCard place={place} onDelete={onDelete} />
    </div>
  );
};

export default memo(RoutiePlaceItem);
