import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useTemporaryState } from '@/@common/hooks/useTemporaryState';
import { useShareLink } from '@/domains/routieSpace/hooks/useShareLink';
import theme from '@/styles/theme';

import {
  LinkCopyButtonStyle,
  LinkInputAreaStyle,
  LinkShareContainerStyle,
} from './ShareView.styles';

const ShareView = () => {
  const { shareLink, handleCopyLink } = useShareLink();
  const { isActive: isCopied, activate } = useTemporaryState(2000);

  const handleLinkCopyClick = () => {
    if (!shareLink) return;

    handleCopyLink().then(() => {
      activate();
    });
  };

  return (
    <Flex direction="column" gap={2} padding="1rem" alignItems="flex-start">
      <Text variant="body" color={theme.colors.gray[200]}>
        링크 공유를 통해 지인을 초대해보세요
      </Text>

      <Flex css={LinkShareContainerStyle} justifyContent="space-between">
        <Flex
          css={LinkInputAreaStyle}
          padding="0 1rem"
          justifyContent="flex-start"
          height="3rem"
          maxWidth="85%"
        >
          <Text variant="caption" color={theme.colors.gray[150]} ellipsis>
            {shareLink}
          </Text>
        </Flex>
        <button
          onClick={handleLinkCopyClick}
          css={LinkCopyButtonStyle(isCopied)}
        >
          <Text variant="label" color={theme.colors.white}>
            {isCopied ? 'Copied' : 'Copy'}
          </Text>
        </button>
      </Flex>
    </Flex>
  );
};

export default ShareView;
