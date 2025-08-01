import theme from '@/styles/theme';

import Text from '../../Text/Text';

type HomeButtonProps = {
  icon: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const HomeButton = ({ icon, onClick, ...props }: HomeButtonProps) => {
  return (
    <>
      <button onClick={onClick} {...props}>
        <img src={icon} />
      </button>
      <Text variant="title" color={theme.colors.purple[400]}>
        Routie
      </Text>
    </>
  );
};

export default HomeButton;
