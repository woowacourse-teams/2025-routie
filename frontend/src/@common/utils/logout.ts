export const logout = (returnTo?: string) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('role');

  if (returnTo) {
    window.location.assign(returnTo);
  } else {
    window.location.reload();
  }
};
