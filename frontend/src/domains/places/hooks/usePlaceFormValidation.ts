import { FormState } from '../components/PlaceFormSection/PlaceForm.types';

export const usePlaceFormValidation = (form: FormState) => {
  const isBreakTimeInvalid =
    (form.breakStartAt === '' && form.breakEndAt !== '') ||
    (form.breakStartAt !== '' && form.breakEndAt === '');

  const isEmpty = {
    name: form.name.trim() === '',
    roadAddressName: form.roadAddressName.trim() === '',
    stayDurationMinutes: form.stayDurationMinutes < 0,
    openAt: form.openAt === '',
    closeAt: form.closeAt === '',
    breakTime: isBreakTimeInvalid,
  };

  const isValid = Object.values(isEmpty).every((field) => !field);

  return { isEmpty, isValid };
};
