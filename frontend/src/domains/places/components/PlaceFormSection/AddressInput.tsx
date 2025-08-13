import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import theme from '@/styles/theme';

interface AddressInputProps {
  value: string;
  onChange: (field: 'roadAddressName', value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const AddressInput = ({ value, onChange }: AddressInputProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="address"
        value={value}
        onChange={(value) => onChange('roadAddressName', value)}
        label="주소"
        placeholder="검색을 통해 장소 주소를 넣어주세요"
        variant="disabled"
        css={{
          '::placeholder': {
            color: `${theme.colors.gray[300]}`,
          },
        }}
      />
    </Flex>
  );
};

export default AddressInput;
