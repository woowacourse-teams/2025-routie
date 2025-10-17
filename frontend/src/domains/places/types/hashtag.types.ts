import type { SearchedPlaceType } from './place.types';
import type { SearchAddressProps } from './searchPlace.types';

interface HashtagProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}
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

interface HashtagFilterContextType {
  selectedHashtags: string[];
  updateHashtagSelection: (hashtag: string) => void;
}

export type {
  HashtagProps,
  AddHashtagDropdownProps,
  EditHashtagDropdownProps,
  HashtagFilterContextType,
};
