import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

const Test = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const fetchTest = async () => {
      await fetch(
        `http://localhost:8080/v1/authentication/oauth?code=${code}&provider=kakao`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    };
    fetchTest();
  }, []);
  return <>테스트</>;
};

export default Test;
