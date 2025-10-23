const getAccessTokenOrThrow = (errorMessage = '로그인이 필요합니다.') => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) throw new Error(errorMessage);

  return accessToken;
};

export { getAccessTokenOrThrow };
