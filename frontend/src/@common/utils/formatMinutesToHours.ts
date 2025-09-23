const formatMinutesToHours = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return '';
  }

  if (minutes === 0) {
    return '0분';
  }

  if (minutes < 60) {
    return `${minutes}분`;
  }

  if (minutes % 60 === 0) {
    return `${minutes / 60}시간`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}시간 ${remainingMinutes}분`;
};

export { formatMinutesToHours };
