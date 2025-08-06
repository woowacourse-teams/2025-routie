package routie.place.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import routie.place.controller.dto.response.SearchedPlacesResponse;
import routie.place.service.PlaceSearchService;

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

