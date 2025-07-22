import { DateType } from '../types/date.types';

export const DAY_KR_TO_EN: Record<string, string> = {
  월: 'MONDAY',
  화: 'TUESDAY',
  수: 'WEDNESDAY',
  목: 'THURSDAY',
  금: 'FRIDAY',
  토: 'SATURDAY',
  일: 'SUNDAY',
};

export const DAY_EN_TO_KR: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

export const DAY_KR_LIST = Object.keys(DAY_KR_TO_EN) as DateType[];
