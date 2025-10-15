import type { SearchedPlaceType } from './place.types';
import type { SearchAddressProps } from './searchPlace.types';

interface BaseHashtagInputProps extends SearchAddressProps {
  place: SearchedPlaceType;
  onCancel: () => void;
}

interface AddHashtagInputProps extends BaseHashtagInputProps {
  mode?: 'add';
  onSubmit: (place: SearchedPlaceType) => Promise<void>;
  initialHashtags?: string[];
}

interface EditHashtagInputProps extends BaseHashtagInputProps {
  mode: 'edit';
  initialHashtags: string[];
  onUpdate: (hashtags: string[]) => Promise<void>;
}

type HashtagInputProps = AddHashtagInputProps | EditHashtagInputProps;

export type { HashtagInputProps };
