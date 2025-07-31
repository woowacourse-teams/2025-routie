import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface StayDurationInputProps {
  value: number;
  onChange: (field: 'stayDurationMinutes', value: string) => void;
  required: boolean;
}

const StayDurationInput = ({
  value,
  onChange,
  required = true,
}: StayDurationInputProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="stayDurationMinutes"
        type="number"
        value={value.toString()}
        onChange={(value) => onChange('stayDurationMinutes', value)}
        label="체류 시간 (분)"
        placeholder="체류 시간을 입력해주세요"
        required={required}
      />
    </Flex>
  );
};

export default StayDurationInput;
