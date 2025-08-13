import Flex from '@/@common/components/Flex/Flex';

import BreakTimeInputs from '../PlaceFormSection/BreakTimeInputs';
import BusinessHourInputs from '../PlaceFormSection/BusinessHourInputs';
import ClosedDaySelector from '../PlaceFormSection/ClosedDaySelector';
import { FormState } from '../PlaceFormSection/PlaceForm.types';

interface AddPlaceValidationProps {
  form: FormState;
  isEmpty: Record<string, boolean>;
  showErrors: boolean;
  handleInputChange: (
    field: keyof Omit<FormState, 'closedDayOfWeeks'>,
    value: string,
  ) => void;
  handleToggleDay: (index: number) => void;
}

const AddPlaceValidation = ({
  form,
  isEmpty,
  showErrors,
  handleInputChange,
  handleToggleDay,
}: AddPlaceValidationProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
      <BusinessHourInputs
        openAt={form.openAt}
        closeAt={form.closeAt}
        onChange={handleInputChange}
        error={{
          openAt: showErrors && isEmpty.openAt,
          closeAt: showErrors && isEmpty.closeAt,
        }}
      />
      <BreakTimeInputs
        breakStartAt={form.breakStartAt}
        breakEndAt={form.breakEndAt}
        onChange={handleInputChange}
        error={{
          breakStartAt: showErrors && isEmpty.breakStartAt,
          breakEndAt: showErrors && isEmpty.breakEndAt,
        }}
      />
      <ClosedDaySelector
        closedDayOfWeeks={form.closedDayOfWeeks}
        onToggleDay={handleToggleDay}
      />
    </Flex>
  );
};

export default AddPlaceValidation;
