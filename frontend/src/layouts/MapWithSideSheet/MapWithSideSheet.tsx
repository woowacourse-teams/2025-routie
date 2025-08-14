import { useState } from 'react';
import KakaoMap from '@/domains/maps/components/KakaoMap';
import Flex from '@/@common/components/Flex/Flex';
import SideSheet from '../SideSheet/SideSheet';
import { containerCss } from './MapWithSideSheet.styles';
import Text from '@/@common/components/Text/Text';

const MapWithSideSheet = () => {
  const [open, setOpen] = useState(true);

  return (
    <Flex>
      <div css={containerCss}>
        <KakaoMap />
        <SideSheet open={open} onToggle={() => setOpen((v) => !v)}></SideSheet>
      </div>
    </Flex>
  );
};

export default MapWithSideSheet;
