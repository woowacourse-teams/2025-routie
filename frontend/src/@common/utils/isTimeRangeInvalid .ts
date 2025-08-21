export const isTimeRangeInvalid = (
  startTime: string,
  endTime: string,
): boolean => {
  if (!startTime || !endTime) return false;
  return endTime < startTime;
};
