import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface AddressInputProps {
  value: string;
  onChange: (field: 'address', value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const AddressInput = ({
  value,
  onChange,
  disabled,
  error = false,
}: AddressInputProps) => {
  const inputVariant = disabled ? 'disabled' : error ? 'error' : 'primary';

  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="address"
        value={value}
        onChange={(value) => onChange('address', value)}
        label="주소"
        placeholder="장소의 주소를 입력해주세요"
        variant={inputVariant}
      />
    </Flex>
  );
};

export default AddressInput;
