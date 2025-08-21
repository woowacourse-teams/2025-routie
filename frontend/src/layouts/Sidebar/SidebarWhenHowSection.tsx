import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import SelectMovingStrategy from '@/domains/routie/components/SelectMovingStrategy/SelectMovingStrategy';

import DateInput from './DateInput';
import { SidebarSectionStyle } from './Sidebar.styles';
import TimeInput from './TimeInput';

const SidebarWhenHowSection = () => {
  return (
    <Flex
      direction="column"
      gap={2}
      padding={1.6}
      width="90%"
      justifyContent="flex-start"
      css={SidebarSectionStyle(false)}
    >
      <Flex width="100%" justifyContent="flex-start" gap={1}>
        <Text variant="title2">언제, 어떻게 떠날까요?</Text>
      </Flex>
      <Flex width="100%" gap={1.2}>
        <DateInput />
        <TimeInput />
      </Flex>
      <SelectMovingStrategy />
    </Flex>
  );
};

export default SidebarWhenHowSection;
