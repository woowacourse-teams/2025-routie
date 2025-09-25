import { useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/', { replace: true });
    return;
  };
  return { handleLogout };
};

export { useLogout };
