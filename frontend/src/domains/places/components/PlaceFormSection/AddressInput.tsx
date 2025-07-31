import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface AddressInputProps {
  value: string;
  onChange: (field: 'address', value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const AddressInput = ({
  value,
  onChange,
  disabled,
  required = true,
}: AddressInputProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="address"
        value={value}
        onChange={(value) => onChange('address', value)}
        label="주소"
        placeholder="장소의 주소를 입력해주세요"
        required={required}
        variant={disabled ? 'disabled' : 'primary'}
      />
    </Flex>
  );
};

export default AddressInput;
