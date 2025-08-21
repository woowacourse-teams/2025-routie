import Flex from '@/@common/components/Flex/Flex';

import { PlaceLocationType } from '../../types/place.types';
import AddressInput from '../PlaceFormSection/AddressInput';
import { FormState } from '../PlaceFormSection/PlaceForm.types';
import PlaceNameInput from '../PlaceFormSection/PlaceNameInput';
import SearchBox from '../SearchBox/SearchBox';
import StayDurationInput from '../StayDurationInput/StayDurationInput';

interface AddPlaceBasicInfoProps {
  form: FormState;
  isEmpty: Record<string, boolean>;
  showErrors: boolean;
  handleInputChange: (
    field: keyof Omit<FormState, 'closedDayOfWeeks'>,
    value: string | null,
  ) => void;
  handleSearchPlaceMap: (placeLocation: PlaceLocationType) => void;
}

const AddPlaceBasicInfo = ({
  form,
  isEmpty,
  showErrors,
  handleInputChange,
  handleSearchPlaceMap,
}: AddPlaceBasicInfoProps) => {
  return (
    <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
      <SearchBox
        onChange={handleInputChange}
        handleSearchPlaceMap={handleSearchPlaceMap}
      />
      <PlaceNameInput
        value={form.name}
        onChange={handleInputChange}
        error={showErrors && isEmpty.name}
        disabled
      />
      <AddressInput
        value={form.roadAddressName || form.addressName}
        onChange={handleInputChange}
        error={showErrors && isEmpty.roadAddressName}
        disabled
      />
      <StayDurationInput
        value={form.stayDurationMinutes}
        onChange={handleInputChange}
        error={showErrors && isEmpty.stayDurationMinutes}
      />
    </Flex>
  );
};

export default AddPlaceBasicInfo;
