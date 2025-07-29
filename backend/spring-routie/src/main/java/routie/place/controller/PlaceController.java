package routie.place.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.place.controller.dto.request.PlaceUpdateRequest;
import routie.place.controller.dto.response.PlaceReadResponse;
import routie.place.service.PlaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class PlaceController {

    private final PlaceService placeService;

    @PatchMapping("/{placeId}")
    public ResponseEntity<Void> updatePlace(
            @PathVariable final long placeId,
            @RequestBody @Valid final PlaceUpdateRequest placeUpdateRequest
    ) {
        placeService.modifyPlace(placeUpdateRequest, placeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{placeId}")
    public ResponseEntity<Void> deletePlace(@PathVariable final long placeId) {
        placeService.removePlace(placeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<PlaceReadResponse> readPlace(@PathVariable final long placeId) {
        final PlaceReadResponse placeReadResponse = placeService.getPlace(placeId);
        return ResponseEntity.ok(placeReadResponse);
    }
}
