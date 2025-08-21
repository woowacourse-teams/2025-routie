export const getFormatedCloseAt = (openAt: string, closeAt: string) => {
  const isNextDay = closeAt < openAt;
  return isNextDay ? `다음날 ${closeAt}` : closeAt;
};
