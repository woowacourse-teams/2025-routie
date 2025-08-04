import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import { getKoreanDateTimeISO } from '@/@common/utils/format';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';

const TimeInput = ({
  time,
  onChange,
}: {
  time: { startDateTime: string; endDateTime: string };
  onChange: (field: 'startDateTime' | 'endDateTime', value: string) => void;
}) => {
  const { isValidateActive } = useRoutieValidateContext();
  const minimumStartDateTime = getKoreanDateTimeISO(new Date());

  const scheduleInputVariant = isValidateActive ? 'primary' : 'disabled';

  return (
    <Flex justifyContent="space-between" width="100%" gap={1}>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          variant={scheduleInputVariant}
          id="startAt"
          label="시작"
          type="datetime-local"
          value={time.startDateTime}
          min={minimumStartDateTime}
          onChange={(value) => onChange('startDateTime', value)}
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          variant={scheduleInputVariant}
          disabled={time.startDateTime === ''}
          id="endAt"
          label="종료"
          type="datetime-local"
          value={time.endDateTime}
          min={time.startDateTime ? time.startDateTime : minimumStartDateTime}
          max={time.startDateTime ? time.startDateTime : minimumStartDateTime}
          onChange={(value) => onChange('endDateTime', value)}
        />
      </Flex>
    </Flex>
  );
};

export default TimeInput;
