package routie.place.infrastructure.search.vworld;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;
import routie.place.infrastructure.search.vworld.api.VWorldPlaceSearchApiClient;
import routie.place.infrastructure.search.vworld.api.dto.request.VWorldPlaceSearchApiRequest;
import routie.place.infrastructure.search.vworld.api.dto.response.VWorldPlaceSearchApiResponse;

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
            throw new IllegalArgumentException("검색어는 비어있을 수 없습니다.");
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 1_000) {
            throw new IllegalArgumentException("검색 결과의 크기는 1에서 1,000 사이여야 합니다.");
        }
    }
}
