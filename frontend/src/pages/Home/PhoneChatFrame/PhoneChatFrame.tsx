import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import chatFooter from '@/assets/images/chat-footer.svg';
import chatHeader from '@/assets/images/chat-header.svg';
import phoneFrame from '@/assets/images/iphone-frame.png';
import kakaoChatImage from '@/assets/images/kakao-chat.svg';

import {
  PhoneContainerStyle,
  ScreenBoxStyle,
  ChatHeaderStyle,
  ChatScrollStyle,
  ChatFooterStyle,
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
          <img src={chatHeader} alt="카톡 헤더" css={ChatHeaderStyle} />
          <div css={ChatScrollStyle}>
            <img src={kakaoChatImage} alt="카톡 대화창" css={ChatImageStyle} />
          </div>
          <img src={chatFooter} alt="카톡 푸터" css={ChatFooterStyle} />
        </div>

        <img src={phoneFrame} alt="아이폰 프레임" css={FrameOverlayStyle} />
      </div>
    </Flex>
  );
};

export default PhoneFrame;
