package routie.place.infrastructure.search.kakao.api.dto.request;

public record KakaoPlaceSearchApiRequest(
        String query,
        Integer size
) {
}
