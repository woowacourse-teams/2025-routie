import { useMemo } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import { getKoreanCurrentDateISO } from '@/@common/utils/format';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';

const DateInput = () => {
  const { isValidateActive, routieTime, handleTimeChange } =
    useRoutieValidateContext();
  const formattedDate = useMemo(() => getKoreanCurrentDateISO(), []);

  return (
    <Flex direction="column" width="100%" gap={1} alignItems="flex-start">
      <Input
        variant={isValidateActive ? 'primary' : 'disabled'}
        id="date"
        label="예정 날짜"
        type="date"
        value={routieTime.date}
        min={formattedDate}
        onChange={(value) => handleTimeChange('date', value)}
      />
    </Flex>
  );
};

export default DateInput;
