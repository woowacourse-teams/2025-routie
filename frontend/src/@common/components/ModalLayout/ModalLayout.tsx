import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Text from '@/@common/components/Text/Text';

import { ModalLayoutStyle } from './ModalLayout.styles';

import type { ModalLayoutProps } from './ModalLayout.types';

const ModalLayout = ({
  title,
  children,
  onClose,
  showCloseButton = true,
  width = '44rem',
}: ModalLayoutProps) => {
  return (
    <div css={ModalLayoutStyle(width)}>
      <Flex direction="column" gap={2}>
        {(title || showCloseButton) && (
          <Flex justifyContent="space-between">
            {title ? <Text variant="subTitle">{title}</Text> : <div />}
            {showCloseButton && (
              <IconButton type="button" icon="close" onClick={onClose} />
            )}
          </Flex>
        )}
        {children}
      </Flex>
    </div>
  );
};

export default ModalLayout;
