export type FormState = {
  name: string;
  address: string;
  stayDurationMinutes: string;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDays: boolean[];
};

export type FormAction =
  | {
      type: 'UPDATE';
      field: keyof Omit<FormState, 'closedDays'>;
      value: string;
    }
  | { type: 'TOGGLE_DAY'; index: number } // ✅ 요일 토글 전용 액션
  | { type: 'RESET' };
