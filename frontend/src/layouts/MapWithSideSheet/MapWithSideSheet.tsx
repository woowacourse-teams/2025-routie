import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import KakaoMap from '@/domains/maps/components/KakaoMap/KakaoMap';

import SideSheet from '../SideSheet/SideSheet';

import { ContainerStyle } from './MapWithSideSheet.styles';

const MapWithSideSheet = () => {
  const [open, setOpen] = useState(true);

  return (
    <Flex>
      <div css={ContainerStyle}>
        <KakaoMap />
        <SideSheet open={open} onToggle={() => setOpen((prev) => !prev)} />
      </div>
    </Flex>
  );
};

export default MapWithSideSheet;
