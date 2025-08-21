package routie.place.infrastructure.search.kakao.api.dto.request;

import routie.exception.BusinessException;
import routie.exception.ErrorCode;

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
            throw new BusinessException(ErrorCode.SEARCH_QUERY_EMPTY);
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 15) {
            throw new BusinessException(ErrorCode.SEARCH_SIZE_INVALID_KAKAO);
        }
    }
}
