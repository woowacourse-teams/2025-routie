import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

export const usePlaceFormValidation = (form: FormState) => {
  const isEmpty = {
    name: form.name.trim() === '',
    roadAddressName: form.roadAddressName.trim() === '',
    stayDurationMinutes: form.stayDurationMinutes < 0,
    openAt: form.openAt === '',
    closeAt: form.closeAt === '',
    breakStartAt: form.breakStartAt === '',
    breakEndAt: form.breakEndAt === '',
  };

  const isValid = usePlaceFormRequiredFieldsValidation(form);

  return { isEmpty, isValid };
};

export const usePlaceFormRequiredFieldsValidation = (form: FormState) => {
  if (
    !form.name ||
    !form.roadAddressName ||
    !form.stayDurationMinutes ||
    !form.openAt ||
    !form.closeAt
  ) {
    return true;
  }

  if (form.breakStartAt && !form.breakEndAt) {
    return true;
  }

  if (!form.breakStartAt && form.breakEndAt) {
    return true;
  }

  return false;
};
