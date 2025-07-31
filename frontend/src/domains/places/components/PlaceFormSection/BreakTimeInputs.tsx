import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface BreakTimeInputsProps {
  breakStartAt: string;
  breakEndAt: string;
  onChange: (field: 'breakStartAt' | 'breakEndAt', value: string) => void;
  required?: boolean;
}

const BreakTimeInputs = ({
  breakStartAt,
  breakEndAt,
  onChange,
}: BreakTimeInputsProps) => {
  const shouldRequireBreakStart = breakEndAt !== '';
  const shouldRequireBreakEnd = breakStartAt !== '';

  return (
    <Flex justifyContent="space-between" width="100%" gap={1}>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="breakStartAt"
          type="time"
          value={breakStartAt}
          onChange={(value) => onChange('breakStartAt', value)}
          label="브레이크 타임 시작 시간"
          required={shouldRequireBreakStart}
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="breakEndAt"
          type="time"
          value={breakEndAt}
          onChange={(value) => onChange('breakEndAt', value)}
          label="브레이크 타임 종료 시간"
          required={shouldRequireBreakEnd}
        />
      </Flex>
    </Flex>
  );
};

export default BreakTimeInputs;
