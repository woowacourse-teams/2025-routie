import { useReducer } from 'react';

import {
  FormAction,
  FormState,
} from '../components/PlaceFormSection/PlaceForm.types';
import { getCheckedListFromClosedDays } from '../utils/getCheckedListFromClosedDays';

import { getCheckedDaysInEnglish } from './../utils/getCheckedDaysInEnglish';

const initialFormState: FormState = {
  name: '',
  address: '',
  stayDurationMinutes: 0,
  openAt: '10:00',
  closeAt: '22:00',
  breakStartAt: '00:00',
  breakEndAt: '00:00',
  closedDayOfWeeks: [],
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_DAY': {
      const stringDays = [...state.closedDayOfWeeks];
      const updated = getCheckedListFromClosedDays(stringDays);
      updated[action.index] = !updated[action.index];
      return { ...state, closedDayOfWeeks: getCheckedDaysInEnglish(updated) };
    }
    case 'RESET':
      return initialFormState;
    case 'INITIALIZE':
      return { ...action.payload };
    default:
      return state;
  }
};

export const useAddPlaceForm = () => {
  const [form, dispatch] = useReducer(formReducer, initialFormState);

  const initializeForm = (data: FormState) => {
    dispatch({ type: 'INITIALIZE', payload: data });
  };

  const handleInputChange = (
    field: keyof Omit<FormState, 'closedDayOfWeeks'>,
    value: string,
  ) => {
    dispatch({ type: 'UPDATE', field, value });
  };

  const handleToggleDay = (index: number) => {
    dispatch({ type: 'TOGGLE_DAY', index });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET' });
  };

  return {
    form,
    initializeForm,
    handleInputChange,
    handleToggleDay,
    resetForm,
  };
};
