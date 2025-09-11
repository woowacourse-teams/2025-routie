import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const useShareLink = () => {
  const [searchParams] = useSearchParams();
  const routieSpaceIdentifier =
    searchParams.get('routieSpaceIdentifier') ??
    localStorage.getItem('routieSpaceUuid');

  const shareLink = useMemo(() => {
    if (!routieSpaceIdentifier) return '';
    return `${window.location.origin}/routie-spaces?routieSpaceIdentifier=${routieSpaceIdentifier}`;
  }, [routieSpaceIdentifier]);

  return shareLink;
};

export { useShareLink };
