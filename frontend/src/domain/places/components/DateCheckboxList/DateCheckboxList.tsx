import Flex from '@/@common/components/Flex/Flex';
import { DateType } from '@/domain/places/types/date.types';

import { DAY_KR_LIST } from '../../constants/day';
import DateCheckbox from '../DateCheckbox/DateCheckbox';

interface DateCheckboxListProps {
  value: boolean[];
  onChange: (index: number) => void;
}

const DateCheckboxList = ({
  value: dateCheckedList,
  onChange: handleCheckboxChange,
}: DateCheckboxListProps) => {
  return (
    <Flex gap={1}>
      {DAY_KR_LIST.map((day, index) => (
        <DateCheckbox
          key={day}
          id={day}
          label={day as DateType}
          isChecked={dateCheckedList[index]}
          onChange={() => handleCheckboxChange(index)}
        />
      ))}
    </Flex>
  );
};

export default DateCheckboxList;
