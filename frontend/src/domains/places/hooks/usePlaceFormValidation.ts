import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

export const usePlaceFormValidation = (form: FormState) => {
  const isEmpty = {
    name: form.name.trim() === '',
    roadAddressName: form.roadAddressName?.trim() === '',
    addressName: form.addressName.trim() === '',
    stayDurationMinutes: form.stayDurationMinutes < 0,
    openAt: form.openAt === '',
    closeAt: form.closeAt === '',
    breakStartAt: form.breakStartAt === null,
    breakEndAt: form.breakEndAt === null,
  };

  const isValid = usePlaceFormRequiredFieldsValidation(form);

  return { isEmpty, isValid };
};

export const usePlaceFormRequiredFieldsValidation = (form: FormState) => {
  if (
    !form.name ||
    !(form.roadAddressName || form.addressName) ||
    !form.openAt ||
    !form.closeAt
  ) {
    return false;
  }

  if (form.breakStartAt && !form.breakEndAt) {
    return false;
  }

  if (!form.breakStartAt && form.breakEndAt) {
    return false;
  }

  return true;
};
