import Icon from '@/@common/components/IconSvg/Icon';

import { ProfileIconStyle } from './Profile.styles';

import type { ProfileProps } from './Profile.types';

const Profile = ({ onClick }: ProfileProps) => {
  return (
    <Icon name="user" size={40} css={ProfileIconStyle} onClick={onClick} />
  );
};

export default Profile;
