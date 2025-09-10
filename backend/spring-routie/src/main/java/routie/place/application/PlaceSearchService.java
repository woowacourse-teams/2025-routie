package routie.place.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.ui.dto.response.SearchedPlacesResponse;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceSearchService {

    private static final int SEARCH_SIZE = 5;
    private final PlaceSearcher placeSearcher;

    public SearchedPlacesResponse search(final String query) {
        List<SearchedPlace> searchedPlaces = placeSearcher.searchPlaces(query, SEARCH_SIZE);

        return SearchedPlacesResponse.from(searchedPlaces);
    }
}
