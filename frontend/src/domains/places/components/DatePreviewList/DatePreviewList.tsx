import Flex from '@/@common/components/Flex/Flex';
import { DateType } from '@/domains/places/types/date.types';

import { DAY_KR_LIST } from '../../constants/day';
import DatePreviewItem from '../DatePreviewItem/DatePreviewItem';

interface DatePreviewListProps {
  value: boolean[];
}

const DatePreviewList = ({ value }: DatePreviewListProps) => {
  return (
    <Flex gap={0.7}>
      {DAY_KR_LIST.map((day, index) => (
        <DatePreviewItem
          key={day}
          label={day as DateType}
          isChecked={value[index]}
        />
      ))}
    </Flex>
  );
};

export default DatePreviewList;
