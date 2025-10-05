import { useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
    return;
  };
  return { handleLogout };
};

export { useLogout };
