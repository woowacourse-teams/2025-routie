import type { SearchedPlaceType } from './place.types';
import type { SearchAddressProps } from './searchPlace.types';

interface AddHashtagDropdownProps extends SearchAddressProps {
  place: SearchedPlaceType;
  onCancel: () => void;
  onSubmit: (place: SearchedPlaceType) => Promise<void>;
  initialHashtags?: string[];
}

interface EditHashtagDropdownProps {
  initialHashtags?: string[];
  onCancel: () => void;
  onUpdate: (hashtags: string[]) => Promise<void>;
}

export type { AddHashtagDropdownProps, EditHashtagDropdownProps };
