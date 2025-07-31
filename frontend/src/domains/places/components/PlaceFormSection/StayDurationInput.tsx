import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface StayDurationInputProps {
  value: number;
  onChange: (field: 'stayDurationMinutes', value: string) => void;
  error?: boolean;
}

const StayDurationInput = ({
  value,
  onChange,
  error = false,
}: StayDurationInputProps) => {
  const inputVariant = error ? 'error' : 'primary';

  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="stayDurationMinutes"
        type="number"
        value={value === -1 ? '' : value.toString()}
        onChange={(value) => onChange('stayDurationMinutes', value)}
        variant={inputVariant}
        label="체류 시간 (분)"
        placeholder="체류 시간을 입력해주세요"
      />
    </Flex>
  );
};

export default StayDurationInput;
