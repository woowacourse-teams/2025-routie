const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export { getAccessToken };
