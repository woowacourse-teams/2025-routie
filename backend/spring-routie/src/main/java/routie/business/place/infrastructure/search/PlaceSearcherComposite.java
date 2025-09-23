package routie.business.place.infrastructure.search;

import java.util.List;
import lombok.RequiredArgsConstructor;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.domain.SearchedPlace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@RequiredArgsConstructor
public class PlaceSearcherComposite implements PlaceSearcher {

    private final List<PlaceSearcher> placeSearchers;

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public List<SearchedPlace> searchPlaces(final String query, final Integer size) {
        return getPlaceSearcher().searchPlaces(query, size);
    }

    public PlaceSearcher getPlaceSearcher() {
        return placeSearchers.stream()
                .filter(PlaceSearcher::isAvailable)
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.PLACE_SEARCH_SERVICE_UNAVAILABLE));
    }
}
