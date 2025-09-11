package routie.business.place.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import routie.business.place.ui.dto.response.SearchedPlacesResponse;
import routie.business.place.application.PlaceSearchService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class PlaceSearchController {

    private final PlaceSearchService placeSearchService;

    @GetMapping("/search")
    public ResponseEntity<SearchedPlacesResponse> searchPlaces(
            @RequestParam("query") final String query
    ) {
        SearchedPlacesResponse searchedPlacesResponse = placeSearchService.search(query);

        return ResponseEntity.ok(searchedPlacesResponse);
    }
}

