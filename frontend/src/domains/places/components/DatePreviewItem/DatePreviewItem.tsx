import Text from '@/@common/components/Text/Text';
import { DateType } from '@/domains/places/types/date.types';

import datePreviewItemStyle from './DatePreviewItem.styles';

interface DatePreviewItemProps {
  label: DateType;
  isChecked: boolean;
}

const DatePreviewItem = ({ label, isChecked }: DatePreviewItemProps) => {
  return (
    <div css={datePreviewItemStyle(isChecked)}>
      <Text color="white" variant="caption">
        {label}
      </Text>
    </div>
  );
};

export default DatePreviewItem;
