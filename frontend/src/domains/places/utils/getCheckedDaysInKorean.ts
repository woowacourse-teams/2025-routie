import { DAY_EN_TO_KR, DAY_KR_TO_EN } from '../constants/day';

export const getCheckedDaysInKorean = (checkedList: boolean[]) => {
  return checkedList
    .map((isChecked, index) =>
      !isChecked ? Object.values(DAY_KR_TO_EN)[index] : null,
    )
    .filter((day): day is keyof typeof DAY_EN_TO_KR => day !== null)
    .map((enDay) => DAY_EN_TO_KR[enDay]);
};
