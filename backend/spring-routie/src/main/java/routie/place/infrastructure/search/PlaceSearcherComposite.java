package routie.place.infrastructure.search;

import java.util.List;
import lombok.RequiredArgsConstructor;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;

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
                .orElseThrow(() -> new IllegalStateException("사용 가능한 장소 검색기가 없습니다."));
    }
}
