import { useCallback, useMemo } from 'react';

import { useSessionStorage } from '@/@common/hooks/useSessionStorage';
import { getCombineDateTime } from '@/@common/utils/format';

const useRoutieTime = () => {
  const [routieTime, setRoutieTime] = useSessionStorage('routieTime', {
    date: '',
    startTime: '09:00',
    endTime: '23:59',
  });

  const combineDateTime = useMemo(() => {
    return getCombineDateTime(routieTime);
  }, [routieTime]);

  const handleTimeChange = useCallback(
    (field: string, value: string) => {
      setRoutieTime({
        ...routieTime,
        [field]: value,
      });
    },
    [routieTime, setRoutieTime],
  );

  const emptyDate = useMemo(() => {
    return routieTime.date === '';
  }, [routieTime.date]);

  return { routieTime, combineDateTime, handleTimeChange, emptyDate };
};

export default useRoutieTime;
