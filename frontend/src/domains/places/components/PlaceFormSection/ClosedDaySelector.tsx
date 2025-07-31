import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import { getCheckedListFromClosedDays } from '../../utils/getCheckedListFromClosedDays';
import DateCheckboxList from '../DateCheckboxList/DateCheckboxList';

interface BusinessHourInputsProps {
  closedDayOfWeeks: string[];
  onToggleDay: (index: number) => void;
}

const ClosedDaySelector = ({
  closedDayOfWeeks,
  onToggleDay,
}: BusinessHourInputsProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap={1}>
      <Text variant="label">영업일</Text>
      <DateCheckboxList
        value={getCheckedListFromClosedDays(closedDayOfWeeks)}
        onChange={onToggleDay}
      />
    </Flex>
  );
};

export default ClosedDaySelector;
