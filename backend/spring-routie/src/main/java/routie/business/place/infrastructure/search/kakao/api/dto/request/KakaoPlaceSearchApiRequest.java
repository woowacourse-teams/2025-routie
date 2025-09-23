package routie.business.place.infrastructure.search.kakao.api.dto.request;

import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

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
