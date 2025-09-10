import Flex from '@/@common/components/Flex/Flex';

import SearchBox from '../SearchBox/SearchBox';

interface AddPlaceBasicInfoProps {
  onClose: () => void;
}

const AddPlaceBasicInfo = ({ onClose }: AddPlaceBasicInfoProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
      <SearchBox onClose={onClose} />
    </Flex>
  );
};

export default AddPlaceBasicInfo;
