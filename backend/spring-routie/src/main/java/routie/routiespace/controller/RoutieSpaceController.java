package routie.routiespace.controller;

import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.place.service.PlaceService;
import routie.routiespace.controller.dto.request.PlaceCreateRequest;
import routie.routiespace.controller.dto.request.UpdateRoutieSpaceNameRequest;
import routie.routiespace.controller.dto.response.PlaceCreateResponse;
import routie.routiespace.controller.dto.response.PlaceListResponse;
import routie.routiespace.controller.dto.response.RoutieSpaceNameResponse;
import routie.routiespace.controller.dto.response.RoutiesResponse;
import routie.routiespace.controller.dto.response.UpdateRoutieSpaceNameResponse;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.service.RoutieSpaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces")
public class RoutieSpaceController {

    private final RoutieSpaceService routieSpaceService;
    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<Void> create() {
        RoutieSpace routieSpace = routieSpaceService.addRoutieSpace();
        URI location = URI.create(String.format("/routie-spaces/%s", routieSpace.getIdentifier()));

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{routieSpaceIdentifier}/routies")
    public ResponseEntity<RoutiesResponse> readRouties(
            @PathVariable final String routieSpaceIdentifier
    ) {
        RoutiesResponse routiesResponse = routieSpaceService.getRouties(routieSpaceIdentifier);

        return ResponseEntity.ok(routiesResponse);
    }

    @GetMapping("/{routieSpaceIdentifier}/name")
    public ResponseEntity<RoutieSpaceNameResponse> readName(
            @PathVariable final String routieSpaceIdentifier
    ) {
        RoutieSpaceNameResponse routieSpaceNameResponse = routieSpaceService.getRoutieSpaceName(routieSpaceIdentifier);
        return ResponseEntity.ok(routieSpaceNameResponse);
    }

    @PatchMapping("/{routieSpaceIdentifier}/name")
    public ResponseEntity<UpdateRoutieSpaceNameResponse> updateName(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final UpdateRoutieSpaceNameRequest updateRoutieSpaceNameRequest
    ) {
        UpdateRoutieSpaceNameResponse updateRoutieSpaceNameResponse = routieSpaceService.modifyRoutieSpaceName(
                routieSpaceIdentifier,
                updateRoutieSpaceNameRequest
        );

        return ResponseEntity.ok(updateRoutieSpaceNameResponse);
    }

    @PostMapping("/{routieSpaceIdentifier}/places")
    public ResponseEntity<PlaceCreateResponse> createPlace(
            @RequestBody @Valid final PlaceCreateRequest placeCreateRequest,
            @PathVariable final String routieSpaceIdentifier
    ) {
        final PlaceCreateResponse placeCreateResponse = placeService.addPlace(
                routieSpaceIdentifier,
                placeCreateRequest
        );
        return ResponseEntity.ok(placeCreateResponse);
    }

    @GetMapping("/{routieSpaceIdentifier}/places")
    public ResponseEntity<PlaceListResponse> readPlaces(@PathVariable final String routieSpaceIdentifier) {
        final PlaceListResponse placeListResponse = placeService.readPlaces(routieSpaceIdentifier);
        return ResponseEntity.ok(placeListResponse);
    }
}
