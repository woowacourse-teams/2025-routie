import Icon from '@/@common/components/IconSvg/Icon';

import { ProfileIconStyle } from './Profile.styles';

interface ProfileProps {
  onClick?: () => void;
}

const Profile = ({ onClick }: ProfileProps) => {
  return (
    <Icon name="user" size={40} css={ProfileIconStyle} onClick={onClick} />
  );
};

export default Profile;
