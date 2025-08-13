import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import theme from '@/styles/theme';

interface PlaceNameInputProps {
  value: string;
  onChange: (field: 'name', value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const PlaceNameInput = ({ value, onChange }: PlaceNameInputProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
      <Input
        id="name"
        value={value}
        onChange={(value) => onChange('name', value)}
        label="이름"
        placeholder="검색을 통해 장소 이름을 넣어주세요"
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

export default PlaceNameInput;
