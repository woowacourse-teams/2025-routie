import { DAY_KR_LIST, DAY_KR_TO_EN } from '../constants/day';

export const getCheckedListExcept = (uncheckedDays: string[]): boolean[] => {
  return DAY_KR_LIST.map((krDay) => {
    const enDay = DAY_KR_TO_EN[krDay];
    return !uncheckedDays.includes(enDay);
  });
};
