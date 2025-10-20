import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useShareLink } from '@/domains/routieSpace/hooks/useShareLink';
import theme from '@/styles/theme';

import {
  LinkCopyButtonStyle,
  LinkInputAreaStyle,
  LinkShareContainerStyle,
} from './ShareView.styles';

const ShareView = () => {
  const [shareClicked, setShareClicked] = useState(false);
  const { showToast } = useToastContext();
  const shareLink = useShareLink();

  const handleCopyClick = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      showToast({ type: 'info', message: '링크가 복사되었습니다.' });
      setShareClicked(true);
    } catch (error) {
      showToast({ type: 'error', message: '링크 복사를 실패하였습니다.' });
    }
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
          onClick={handleCopyClick}
          css={LinkCopyButtonStyle(shareClicked)}
        >
          <Text variant="label" color={theme.colors.white}>
            {shareClicked ? 'Copied' : 'Copy'}
          </Text>
        </button>
      </Flex>
    </Flex>
  );
};

export default ShareView;
