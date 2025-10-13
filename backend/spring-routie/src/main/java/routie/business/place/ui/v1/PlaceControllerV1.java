package routie.business.place.ui.v1;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.place.ui.dto.request.PlaceCreateRequest;
import routie.business.place.ui.dto.request.UpdateHashtagsRequest;
import routie.business.place.ui.dto.response.PlaceCreateResponse;
import routie.business.place.ui.dto.response.PlaceListResponse;
import routie.business.place.ui.dto.response.PlaceReadResponse;
import routie.business.place.ui.dto.response.UpdateHashtagsResponse;
import routie.business.place.application.PlaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/routie-spaces/{routieSpaceIdentifier}/places")
public class PlaceControllerV1 {

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

    @DeleteMapping("/{placeId}")
    public ResponseEntity<Void> deletePlace(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final long placeId
    ) {
        placeService.removePlace(routieSpaceIdentifier, placeId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{placeId}/hashtags")
    public ResponseEntity<UpdateHashtagsResponse> updateHashtags(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final long placeId,
            @RequestBody @Valid final UpdateHashtagsRequest updateHashTagsRequest
    ) {
        final UpdateHashtagsResponse response = placeService.modifyHashtags(
                routieSpaceIdentifier,
                placeId,
                updateHashTagsRequest
        );
        return ResponseEntity.ok(response);
    }
}
