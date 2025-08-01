import { DAY_KR_LIST, DAY_KR_TO_EN } from '../constants/day';

export const getCheckedDaysInEnglish = (checkedList: boolean[]) => {
  return checkedList
    .map((isChecked, index) => (!isChecked ? DAY_KR_LIST[index] : null))
    .filter((day): day is (typeof DAY_KR_LIST)[number] => day !== null)
    .map((krDay) => DAY_KR_TO_EN[krDay]);
};
