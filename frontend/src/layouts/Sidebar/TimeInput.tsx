import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

const TimeInput = ({
  time,
  onChange,
}: {
  time: { startDateTime: string; endDateTime: string };
  onChange: (field: 'startDateTime' | 'endDateTime', value: string) => void;
}) => {
  return (
    <Flex justifyContent="space-between" width="100%" gap={1}>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="startAt"
          label="시작"
          type="datetime-local"
          value={time.startDateTime}
          onChange={(value) => onChange('startDateTime', value)}
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="endAt"
          label="종료"
          type="datetime-local"
          value={time.endDateTime}
          onChange={(value) => onChange('endDateTime', value)}
        />
      </Flex>
    </Flex>
  );
};

export default TimeInput;
