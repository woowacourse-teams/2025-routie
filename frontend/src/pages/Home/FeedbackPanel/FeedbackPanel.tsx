import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import {
  FeedbackSectionStyle,
  FeedbackButtonStyle,
  linkStyle,
} from './FeedbackPanel.styles';

interface FeedbackPanelProps {
  isVisible: boolean;
}

const FeedbackPanel = ({ isVisible }: FeedbackPanelProps) => {
  const FEEDBACK_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSfixG5-LD4kYYC3T0XueS7Ud7XHXbA53gJGxb60x4qwLl_4qA/viewform';

  return (
    <Flex width="20rem" padding={2} css={FeedbackSectionStyle({ isVisible })}>
      <Flex direction="column" gap={2}>
        <Flex direction="column" gap={2}>
          <Text variant="subTitle">루티가 불편하다면?</Text>
          <Text variant="caption">개발자에게 피드백을 주세요!</Text>
        </Flex>
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          css={[linkStyle, FeedbackButtonStyle]}
        >
          <Text variant="caption" color={theme.colors.white}>
            피드백 작성하러 가기
          </Text>
        </a>
      </Flex>
    </Flex>
  );
};

export default FeedbackPanel;
