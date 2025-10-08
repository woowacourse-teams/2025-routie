const useLogout = () => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    window.location.reload();
    return;
  };
  return { handleLogout };
};

export { useLogout };
