import { STEP_REQUIRED_FIELDS } from '../constants/step';

export const getValidatedStep = (
  step: 1 | 2,
  isEmpty: Record<string, boolean>,
) => {
  return STEP_REQUIRED_FIELDS[step].every((key) => {
    if (step === 1) {
      return !isEmpty['roadAddressName'] || !isEmpty['addressName'];
    }
    return !isEmpty[key];
  });
};
