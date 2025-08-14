package routie.place.infrastructure.search.vworld.api.dto.request;

public record VWorldPlaceSearchApiRequest(
        String query,
        Integer size
) {

    public VWorldPlaceSearchApiRequest {
        validateQuery(query);
        validateSize(size);
    }

    private void validateQuery(final String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("검색어는 비어있을 수 없습니다.");
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 1_000) {
            throw new IllegalArgumentException("검색 결과의 크기는 1에서 1,000 사이여야 합니다.");
        }
    }
}
