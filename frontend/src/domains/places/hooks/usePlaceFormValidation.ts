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

  const isValid = Object.values(isEmpty).every((field) => !field);

  return { isEmpty, isValid };
};
