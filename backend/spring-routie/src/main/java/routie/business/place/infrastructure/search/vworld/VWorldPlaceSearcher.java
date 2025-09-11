package routie.business.place.infrastructure.search.vworld;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.global.exception.BusinessException;
import routie.global.exception.ErrorCode;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.domain.SearchedPlace;
import routie.business.place.infrastructure.search.vworld.api.VWorldPlaceSearchApiClient;
import routie.business.place.infrastructure.search.vworld.api.dto.request.VWorldPlaceSearchApiRequest;
import routie.business.place.infrastructure.search.vworld.api.dto.response.VWorldPlaceSearchApiResponse;

@Component
@RequiredArgsConstructor
public class VWorldPlaceSearcher implements PlaceSearcher {

    private final VWorldPlaceSearchApiClient vWorldPlaceSearchApiClient;

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public List<SearchedPlace> searchPlaces(final String query, final Integer size) {
        validateQuery(query);
        validateSize(size);

        VWorldPlaceSearchApiResponse vWorldPlaceSearchApiResponse = vWorldPlaceSearchApiClient.search(
                new VWorldPlaceSearchApiRequest(query, size)
        );
        if (vWorldPlaceSearchApiResponse.isDataNotFound()) {
            return List.of();
        }
        return vWorldPlaceSearchApiResponse.toSearchedPlaces();
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
