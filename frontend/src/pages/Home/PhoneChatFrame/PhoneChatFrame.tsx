import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import phoneFrame from '@/assets/images/iphone-frame.png';
import kakaoChatImage from '@/assets/images/kakao-chat.svg';

import {
  PhoneContainerStyle,
  ScreenBoxStyle,
  ChatScrollStyle,
  ChatImageStyle,
  FrameOverlayStyle,
} from './PhoneChatFrame.styles';

const PhoneFrame = () => {
  return (
    <Flex direction="column">
      <Flex>
        <Icon name="scroll" size={26} />
        <Text variant="subTitle">스크롤해 보세요!</Text>
      </Flex>
      <div css={PhoneContainerStyle}>
        <div css={ScreenBoxStyle}>
          <div css={ChatScrollStyle}>
            <img src={kakaoChatImage} alt="카톡 대화창" css={ChatImageStyle} />
          </div>
        </div>

        <img src={phoneFrame} alt="아이폰 프레임" css={FrameOverlayStyle} />
      </div>
    </Flex>
  );
};

export default PhoneFrame;
