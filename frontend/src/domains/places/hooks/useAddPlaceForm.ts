import { useReducer } from 'react';

import {
  FormAction,
  FormState,
} from '../components/PlaceFormSection/PlaceForm.types';

const initialFormState: FormState = {
  name: '',
  address: '',
  stayDurationMinutes: '0',
  openAt: '10:00',
  closeAt: '22:00',
  breakStartAt: '00:00',
  breakEndAt: '00:00',
  closedDays: [true, true, true, true, true, true, true],
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_DAY': {
      const updated = [...state.closedDays];
      updated[action.index] = !updated[action.index];
      return { ...state, closedDays: updated };
    }
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
};

export const useAddPlaceForm = () => {
  const [form, dispatch] = useReducer(formReducer, initialFormState);

  const handleInputChange = (
    field: keyof Omit<FormState, 'closedDays'>,
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
    handleInputChange,
    handleToggleDay,
    resetForm,
  };
};
