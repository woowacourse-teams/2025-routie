import Text from '@/@common/components/Text/Text';
import { DateType } from '@/domain/places/types/date.types';

import {
  DateCheckboxInputStyle,
  DateCheckboxLabelStyle,
} from './DateCheckbox.styles';

interface DateCheckboxProps {
  id: string;
  label: DateType;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const DateCheckbox = ({
  id,
  label,
  isChecked,
  onChange,
}: DateCheckboxProps) => {
  return (
    <div>
      <input css={DateCheckboxInputStyle} type="checkbox" id={id} />
      <label
        css={DateCheckboxLabelStyle(isChecked)}
        htmlFor={id}
        onClick={() => onChange(!isChecked)}
      >
        <Text color="white" variant="caption">
          {label}
        </Text>
      </label>
    </div>
  );
};

export default DateCheckbox;
