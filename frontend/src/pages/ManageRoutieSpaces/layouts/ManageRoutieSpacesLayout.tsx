import Flex from '@/@common/components/Flex/Flex';

import { ManageRoutieSpacesLayoutStyle } from './ManageRoutieSpacesLayout.styles';

const ManageRoutieSpacesLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Flex
      direction="column"
      gap={3}
      width="70%"
      maxWidth="1580px"
      alignItems="flex-start"
      padding="1rem 0"
      margin="0 auto"
      css={ManageRoutieSpacesLayoutStyle}
    >
      {children}
    </Flex>
  );
};

export default ManageRoutieSpacesLayout;
