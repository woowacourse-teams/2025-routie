import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

const TimeInput = ({
  time,
  onChange,
}: {
  time: { startAt: string; endAt: string };
  onChange: (field: string, value: string) => void;
}) => {
  return (
    <Flex justifyContent="space-between" width="100%" gap={1}>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="startAt"
          label="시작 시간"
          type="time"
          value={time.startAt}
          onChange={(value) => onChange('startAt', value)}
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="endAt"
          label="종료 시간"
          type="time"
          value={time.endAt}
          onChange={(value) => onChange('endAt', value)}
        />
      </Flex>
    </Flex>
  );
};

export default TimeInput;
