import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';

import { getCheckedListFromClosedDays } from '../../utils/getCheckedListFromClosedDays';
import DateCheckboxList from '../DateCheckboxList/DateCheckboxList';

import { FormState } from './PlaceForm.types';

interface OptionalInfoSectionProps {
  form: Pick<
    FormState,
    | 'stayDurationMinutes'
    | 'openAt'
    | 'closeAt'
    | 'breakStartAt'
    | 'breakEndAt'
    | 'closedDays'
  >;
  onChange: (field: keyof Omit<FormState, 'closedDays'>, value: string) => void;
  onToggleDay: (index: number) => void;
}

const OptionalInfoSection = ({
  form,
  onChange,
  onToggleDay,
}: OptionalInfoSectionProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
      <Text variant="subTitle" color="purple">
        옵션 정보
      </Text>
      <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
        <Input
          id="stayDurationMinutes"
          type="number"
          value={form.stayDurationMinutes.toString()}
          onChange={(value) => onChange('stayDurationMinutes', value)}
          label="체류 시간 (분)"
          placeholder="체류 시간을 입력해주세요"
        />
      </Flex>
      <Text variant="caption">영업시간</Text>
      <Flex justifyContent="space-between" width="100%" gap={1}>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="openAt"
            type="time"
            value={form.openAt}
            onChange={(value) => onChange('openAt', value)}
            label="오픈 시간"
          />
        </Flex>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="closeAt"
            type="time"
            value={form.closeAt}
            onChange={(value) => onChange('closeAt', value)}
            label="마감 시간"
          />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" width="100%" gap={1}>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="breakStartAt"
            type="time"
            value={form.breakStartAt}
            onChange={(value) => onChange('breakStartAt', value)}
            label="브레이크 타임 시작 시간"
          />
        </Flex>
        <Flex direction="column" alignItems="flex-start" gap={1} width="100%">
          <Input
            id="breakEndAt"
            type="time"
            value={form.breakEndAt}
            onChange={(value) => onChange('breakEndAt', value)}
            label="브레이크 타임 종료 시간"
          />
        </Flex>
      </Flex>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Text variant="label">영업일</Text>
        <DateCheckboxList
          value={getCheckedListFromClosedDays(form.closedDays)}
          onChange={onToggleDay}
        />
      </Flex>
    </Flex>
  );
};

export default OptionalInfoSection;
