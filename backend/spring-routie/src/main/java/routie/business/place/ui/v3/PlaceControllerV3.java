package routie.business.place.ui.v3;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.place.application.PlaceService;
import routie.business.place.ui.dto.request.PlaceCreateRequestV3;
import routie.business.place.ui.dto.response.PlaceCreateResponse;
import routie.business.place.ui.dto.response.PlaceListResponseV3;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v3/routie-spaces/{routieSpaceIdentifier}/places")
public class PlaceControllerV3 {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<PlaceCreateResponse> createPlace(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final PlaceCreateRequestV3 placeCreateRequest
    ) {
        final PlaceCreateResponse placeCreateResponse = placeService.addPlaceV3(
                routieSpaceIdentifier,
                placeCreateRequest
        );
        return ResponseEntity.ok(placeCreateResponse);
    }

    @GetMapping
    public ResponseEntity<PlaceListResponseV3> readPlaces(@PathVariable final String routieSpaceIdentifier) {
        final PlaceListResponseV3 placeListResponse = placeService.readPlacesV3(routieSpaceIdentifier);
        return ResponseEntity.ok(placeListResponse);
    }
}
