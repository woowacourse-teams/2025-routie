import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';

interface BusinessHourInputsProps {
  openAt: string;
  closeAt: string;
  onChange: (field: 'openAt' | 'closeAt', value: string) => void;
  required?: boolean;
}

const BusinessHourInputs = ({
  openAt,
  closeAt,
  onChange,
  required = true,
}: BusinessHourInputsProps) => {
  return (
    <>
      <Text variant="caption">영업시간</Text>
      <Flex justifyContent="space-between" width="100%" gap={1}>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="openAt"
            type="time"
            value={openAt}
            onChange={(value) => onChange('openAt', value)}
            label="오픈 시간"
            required={required}
          />
        </Flex>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="closeAt"
            type="time"
            value={closeAt}
            onChange={(value) => onChange('closeAt', value)}
            label="마감 시간"
            required={required}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default BusinessHourInputs;
