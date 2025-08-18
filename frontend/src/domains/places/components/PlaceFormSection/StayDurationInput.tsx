import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { STAYDURATION_STEP_OPTIONS } from '../../constants/step';

interface StayDurationInputProps {
  value: number;
  onChange: (field: 'stayDurationMinutes', value: string) => void;
  error?: boolean;
}

const StayDurationInput = ({
  value,
  onChange,
  error = false,
}: StayDurationInputProps) => {
  const inputVariant = error ? 'error' : 'primary';

  const handleStayDurationButton = (buttonNumber: number) => {
    onChange('stayDurationMinutes', String(Math.max(0, value + buttonNumber)));
  };

  return (
    <Flex direction="column" alignItems="flex-start" gap={0.75} width="100%">
      <Text variant="caption">체류 시간 (분)</Text>

      <Flex
        gap={0.6}
        width="100%"
        css={css`
          flex: 0 0 auto;
        `}
      >
        <div
          css={css`
            flex: 0 0 auto;
          `}
        >
          <Input
            id="stayDurationMinutes"
            type="number"
            value={value.toString()}
            onChange={(v) => onChange('stayDurationMinutes', v)}
            variant={inputVariant}
            placeholder="체류 시간을 입력해주세요"
            step={10}
            min={0}
          />
        </div>

        {STAYDURATION_STEP_OPTIONS.map((durationStep) => (
          <Button
            key={durationStep}
            type="button"
            onClick={() => handleStayDurationButton(durationStep)}
            css={css`
              justify-content: center;

              :hover {
                color: ${theme.colors.white};
                background-color: ${theme.colors.purple[300]};
              }
            `}
          >
            {durationStep > 0 ? `+${durationStep}` : durationStep}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default StayDurationInput;
