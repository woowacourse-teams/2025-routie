package routie.business.place.ui.v2;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.place.application.PlaceService;
import routie.business.place.ui.dto.response.PlaceListResponseV2;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v2/routie-spaces/{routieSpaceIdentifier}/places")
public class PlaceControllerV2 {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<PlaceListResponseV2> readPlaces(@PathVariable final String routieSpaceIdentifier) {
        final PlaceListResponseV2 placeListResponse = placeService.readPlacesV2(routieSpaceIdentifier);
        return ResponseEntity.ok(placeListResponse);
    }
}
