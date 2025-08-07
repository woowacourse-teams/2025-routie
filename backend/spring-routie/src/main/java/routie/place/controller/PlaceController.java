package routie.place.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.place.controller.dto.request.PlaceCreateRequest;
import routie.place.controller.dto.request.PlaceUpdateRequest;
import routie.place.controller.dto.response.PlaceCreateResponse;
import routie.place.controller.dto.response.PlaceListResponse;
import routie.place.controller.dto.response.PlaceReadResponse;
import routie.place.service.PlaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces/{routieSpaceIdentifier}/places")
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<PlaceCreateResponse> createPlace(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final PlaceCreateRequest placeCreateRequest
    ) {
        final PlaceCreateResponse placeCreateResponse = placeService.addPlace(
                routieSpaceIdentifier,
                placeCreateRequest
        );
        return ResponseEntity.ok(placeCreateResponse);
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<PlaceReadResponse> readPlace(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final long placeId
    ) {
        final PlaceReadResponse placeReadResponse = placeService.getPlace(routieSpaceIdentifier, placeId);
        return ResponseEntity.ok(placeReadResponse);
    }

    @GetMapping
    public ResponseEntity<PlaceListResponse> readPlaces(@PathVariable final String routieSpaceIdentifier) {
        final PlaceListResponse placeListResponse = placeService.readPlaces(routieSpaceIdentifier);
        return ResponseEntity.ok(placeListResponse);
    }

    @PatchMapping("/{placeId}")
    public ResponseEntity<Void> updatePlace(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final long placeId,
            @RequestBody @Valid final PlaceUpdateRequest placeUpdateRequest
    ) {
        placeService.modifyPlace(placeUpdateRequest, routieSpaceIdentifier, placeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{placeId}")
    public ResponseEntity<Void> deletePlace(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final long placeId
    ) {
        placeService.removePlace(routieSpaceIdentifier, placeId);
        return ResponseEntity.noContent().build();
    }
}
