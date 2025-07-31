import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';

interface PlaceNameInputProps {
  value: string;
  onChange: (field: 'name', value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const PlaceNameInput = ({
  value,
  onChange,
  disabled,
  error = false,
}: PlaceNameInputProps) => {
  const inputVariant = disabled ? 'disabled' : error ? 'error' : 'primary';

  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="name"
        value={value}
        onChange={(value) => onChange('name', value)}
        label="이름"
        placeholder="장소의 이름을 입력해주세요"
        // required={required}
        variant={inputVariant}
      />
    </Flex>
  );
};

export default PlaceNameInput;
