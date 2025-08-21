import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';

const TimeInput = () => {
  const { isValidateActive, routieTime, handleTimeChange } =
    useRoutieValidateContext();

  const scheduleInputVariant =
    isValidateActive && routieTime.date !== '' ? 'primary' : 'disabled';

  return (
    <Flex justifyContent="space-between" width="100%" gap={1}>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          variant={scheduleInputVariant}
          disabled={routieTime.date === '' || !isValidateActive}
          id="startAt"
          label="시작 시간"
          type="time"
          value={routieTime.startTime}
          step="600"
          onChange={(value) => handleTimeChange('startTime', value)}
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          variant={scheduleInputVariant}
          disabled={
            routieTime.date === '' ||
            routieTime.startTime === '' ||
            !isValidateActive
          }
          id="endAt"
          label="종료 시간"
          type="time"
          value={routieTime.endTime}
          step="600"
          onChange={(value) => handleTimeChange('endTime', value)}
        />
      </Flex>
    </Flex>
  );
};

export default TimeInput;
