import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useShareLink } from '@/domains/routieSpace/hooks/useShareLink';

import { SidebarSectionStyle } from './Sidebar.styles';

const ShareLinkButtonSection = () => {
  const { showToast } = useToastContext();
  const shareLink = useShareLink();
  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast({ type: 'info', message: '링크가 복사되었습니다.' });
    } catch (error) {
      showToast({ type: 'error', message: '링크 복사를 실패하였습니다.' });
    }
  };

  return (
    <Flex
      direction="column"
      gap={2}
      padding={1.6}
      width="90%"
      css={SidebarSectionStyle(false)}
    >
      <Button variant="secondary" onClick={handleCopy}>
        <Flex gap={1} justifyContent="flex-start">
          <Icon name="copy" size={20} />
          <Text variant="caption">링크 공유</Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default ShareLinkButtonSection;
