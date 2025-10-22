package routie.business.place.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.domain.SearchedPlace;
import routie.business.place.ui.dto.response.SearchedPlacesResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceSearchService {

    private static final int SEARCH_SIZE = 15;
    private final PlaceSearcher placeSearcher;

    public SearchedPlacesResponse search(final String query) {
        final List<SearchedPlace> searchedPlaces = placeSearcher.searchPlaces(query, SEARCH_SIZE);

        return SearchedPlacesResponse.from(searchedPlaces);
    }
}
