import { useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import routieSpaceNameInputStyle from './RoutieSpaceName.style';

const RoutieSpaceName = () => {
  const [name, setName] = useState('새 루티 스페이스');
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Flex alignItems="center" justifyContent="space-between" width="59rem">
      {isEditing ? (
        <input
          id="routie-space-name"
          css={routieSpaceNameInputStyle}
          maxLength={20}
          autoFocus
          value={name}
          onChange={handleChange}
        />
      ) : (
        <Text variant="title">{name}</Text>
      )}
      <Button variant="primary" onClick={handleClick}>
        수정
      </Button>
    </Flex>
  );
};

export default RoutieSpaceName;
