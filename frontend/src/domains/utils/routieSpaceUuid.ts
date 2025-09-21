const getRoutieSpaceUuid = (): string | null => {
  return typeof window !== 'undefined'
    ? localStorage.getItem('routieSpaceUuid')
    : null;
};

const ensureRoutieSpaceUuid = (uuid: null | string) => {
  if (!uuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
};

export { getRoutieSpaceUuid, ensureRoutieSpaceUuid };
