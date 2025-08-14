package routie.place.infrastructure.search.kakao.api.dto.request;

public record KakaoPlaceSearchApiRequest(
        String query,
        Integer size
) {

    public KakaoPlaceSearchApiRequest {
        validateQuery(query);
        validateSize(size);
    }

    private void validateQuery(final String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("검색어는 비어있을 수 없습니다.");
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 15) {
            throw new IllegalArgumentException("검색 결과의 크기는 1에서 15 사이여야 합니다.");
        }
    }
}
