import Flex from '@/@common/components/Flex/Flex';
import { DateType } from '@/domains/places/types/date.types';

import { DAY_KR_LIST } from '../../constants/day';
import DatePreviewItem from '../DatePreviewItem/DatePreviewItem';

interface DatePreviewListProps {
  value: boolean[];
}

const DatePreviewList = ({ value }: DatePreviewListProps) => {
  return (
    <Flex justifyContent="space-around" width="100%" gap={0.3}>
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
