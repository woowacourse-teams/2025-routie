package routie.place.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.controller.dto.response.SearchedPlacesResponse;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceSearchService {

    private final PlaceSearcher placeSearcher;

    public SearchedPlacesResponse search(final String query) {
        List<SearchedPlace> searchedPlaces = placeSearcher.search(query);

        return SearchedPlacesResponse.from(searchedPlaces);
    }
}
