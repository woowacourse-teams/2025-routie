import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';

interface RequiredInfoSectionProps {
  name: string;
  address: string;
  onChange: (field: 'name' | 'address', value: string) => void;
}

const RequiredInfoSection = ({
  name,
  address,
  onChange,
}: RequiredInfoSectionProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
      <Text variant="subTitle" color="purple">
        필수 정보
      </Text>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="name"
          value={name}
          onChange={(value) => onChange('name', value)}
          label="이름"
          placeholder="장소의 이름을 입력해주세요"
          required
        />
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="address"
          value={address}
          onChange={(value) => onChange('address', value)}
          label="주소"
          placeholder="장소의 주소를 입력해주세요"
          required
        />
      </Flex>
    </Flex>
  );
};

export default RequiredInfoSection;
