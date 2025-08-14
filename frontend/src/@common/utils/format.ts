export const getKoreanCurrentDateISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getKoreanCurrentTimeHM = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getCombineDateTime = (dateTime: {
  date: string;
  startTime: string;
  endTime: string;
}) => {
  if (!dateTime.date || !dateTime.startTime || !dateTime.endTime) {
    return { startDateTime: '', endDateTime: '' };
  }

  return {
    startDateTime: `${dateTime.date}T${dateTime.startTime}:00`,
    endDateTime: `${dateTime.date}T${dateTime.endTime}:00`,
  };
};
