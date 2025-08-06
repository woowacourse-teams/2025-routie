export type FormState = {
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDayOfWeeks: string[];
  longitude: 0;
  latitude: 0;
  id: '';
};

export type FormAction =
  | {
      type: 'UPDATE';
      field: keyof Omit<FormState, 'closedDayOfWeeks'>;
      value: string | number;
    }
  | { type: 'TOGGLE_DAY'; index: number }
  | { type: 'RESET' }
  | { type: 'INITIALIZE'; payload: FormState };
