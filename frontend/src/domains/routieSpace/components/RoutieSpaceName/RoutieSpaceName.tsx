import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Text from '@/@common/components/Text/Text';
import editIcon from '@/assets/icons/edit.svg';

import {
  editRoutieSpaceName,
  getRoutieSpaceName,
} from '../../apis/routieSpaceName';

import routieSpaceNameInputStyle from './RoutieSpaceName.style';

const RoutieSpaceName = () => {
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchRoutieSpaceName = async () => {
      const name = await getRoutieSpaceName();
      setName(name ?? '이름 못 찾음');
    };
    fetchRoutieSpaceName();
  }, []);

  const handleClick = async () => {
    if (isEditing) {
      try {
        const updatedName = await editRoutieSpaceName(name);
        setName(updatedName ?? '이름 못 찾음');
      } catch (error) {
        console.error('루티 스페이스 이름 수정 중 에러 발생:', error);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      margin={0.4}
      gap={3}
    >
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
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          padding={0.4}
          width="100%"
        >
          <Text variant="title">{name}</Text>
        </Flex>
      )}
      <IconButton icon={editIcon} onClick={handleClick} />
    </Flex>
  );
};

export default RoutieSpaceName;
