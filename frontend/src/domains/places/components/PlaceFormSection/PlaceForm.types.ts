export type FormState = {
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDays: string[];
};

export type FormAction =
  | {
      type: 'UPDATE';
      field: keyof Omit<FormState, 'closedDays'>;
      value: string;
    }
  | { type: 'TOGGLE_DAY'; index: number }
  | { type: 'RESET' }
  | { type: 'INITIALIZE'; payload: FormState };
