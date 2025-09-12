package routie.business.place.infrastructure.search.vworld.api.dto.request;

import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

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
            throw new BusinessException(ErrorCode.SEARCH_QUERY_EMPTY);
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 1_000) {
            throw new BusinessException(ErrorCode.SEARCH_SIZE_INVALID_VWORLD);
        }
    }
}
