const KAKAO_PLACE_URL = 'https://place.map.kakao.com';

const openExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const getKakaoPlaceUrl = (kakaoPlaceId: string) => {
  return `${KAKAO_PLACE_URL}/${kakaoPlaceId}`;
};

const openKakaoPlace = (kakaoPlaceId: string) => {
  const url = getKakaoPlaceUrl(kakaoPlaceId);
  openExternalLink(url);
};

export { openExternalLink, getKakaoPlaceUrl, openKakaoPlace };
