import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';

interface BusinessHourInputsProps {
  openAt: string;
  closeAt: string;
  onChange: (field: 'openAt' | 'closeAt', value: string) => void;
  error?: {
    openAt?: boolean;
    closeAt?: boolean;
  };
}

const BusinessHourInputs = ({
  openAt,
  closeAt,
  onChange,
  error = { openAt: false, closeAt: false },
}: BusinessHourInputsProps) => {
  return (
    <>
      <Text variant="label">
        세밀한 동선 검증을 원하신다면, 실제 영업 시간과 영업일을 입력해주세요!
      </Text>
      <Text variant="caption">영업시간</Text>
      <Flex direction="column" gap={0.5} width="100%" alignItems="flex-start">
        <Flex justifyContent="space-between" width="100%" gap={1}>
          <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
            <Input
              id="openAt"
              type="time"
              value={openAt}
              onChange={(value) => onChange('openAt', value)}
              variant={error?.openAt ? 'error' : 'primary'}
              label="오픈 시간"
              autoFocus
            />
          </Flex>
          <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
            <Input
              id="closeAt"
              type="time"
              value={closeAt}
              onChange={(value) => onChange('closeAt', value)}
              variant={error?.closeAt ? 'error' : 'primary'}
              label="마감 시간"
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default BusinessHourInputs;
