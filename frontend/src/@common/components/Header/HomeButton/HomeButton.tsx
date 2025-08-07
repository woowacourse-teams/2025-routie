import theme from '@/styles/theme';

import Flex from '../../Flex/Flex';
import Text from '../../Text/Text';

type HomeButtonProps = {
  icon: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const HomeButton = ({ icon, onClick, ...props }: HomeButtonProps) => {
  return (
    <button onClick={onClick} {...props}>
      <Flex gap={1}>
        <img src={icon} />
        <Text variant="title" color={theme.colors.purple[400]}>
          Routie
        </Text>
      </Flex>
    </button>
  );
};

export default HomeButton;
