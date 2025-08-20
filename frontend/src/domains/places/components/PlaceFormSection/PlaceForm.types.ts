export type FormState = {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDayOfWeeks: string[];
};

export type FormAction =
  | {
      type: 'UPDATE';
      field: keyof Omit<FormState, 'closedDayOfWeeks'>;
      value: string | number | null;
    }
  | { type: 'TOGGLE_DAY'; index: number }
  | { type: 'RESET' }
  | { type: 'INITIALIZE'; payload: FormState };
