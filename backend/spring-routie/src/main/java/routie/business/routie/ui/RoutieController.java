package routie.business.routie.ui;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import routie.business.routie.ui.dto.request.RoutiePlaceCreateRequest;
import routie.business.routie.ui.dto.request.RoutieUpdateRequest;
import routie.business.routie.ui.dto.response.RoutiePlaceCreateResponse;
import routie.business.routie.ui.dto.response.RoutieReadResponse;
import routie.business.routie.ui.dto.response.RoutieValidationResponse;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.application.RoutieService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces/{routieSpaceIdentifier}/routie")
public class RoutieController {

    private final RoutieService routieService;

    @PostMapping("/places")
    public ResponseEntity<RoutiePlaceCreateResponse> createRoutiePlace(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final RoutiePlaceCreateRequest routiePlaceCreateRequest
    ) {
        RoutiePlaceCreateResponse routiePlaceCreateResponse = routieService.addRoutiePlace(
                routieSpaceIdentifier,
                routiePlaceCreateRequest
        );
        return ResponseEntity.ok(routiePlaceCreateResponse);
    }

    @GetMapping
    public ResponseEntity<RoutieReadResponse> readRoutie(
            @PathVariable final String routieSpaceIdentifier,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDateTime,
            @RequestParam(required = false) final MovingStrategy movingStrategy
    ) {
        return ResponseEntity.ok(routieService.getRoutie(routieSpaceIdentifier, startDateTime, movingStrategy));
    }

    @GetMapping("/validation")
    public ResponseEntity<RoutieValidationResponse> validateRoutie(
            @PathVariable final String routieSpaceIdentifier,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime endDateTime,
            @RequestParam final MovingStrategy movingStrategy
    ) {
        RoutieValidationResponse routieValidationResponse = routieService.validateRoutie(
                routieSpaceIdentifier,
                startDateTime,
                endDateTime,
                movingStrategy
        );
        return ResponseEntity.ok(routieValidationResponse);
    }

    @PatchMapping
    public ResponseEntity<Void> updateRoutie(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody final RoutieUpdateRequest routieUpdateRequest
    ) {
        routieService.modifyRoutie(routieSpaceIdentifier, routieUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/places/{placeId}")
    public ResponseEntity<Void> deleteRoutiePlace(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final Long placeId
    ) {
        routieService.removeRoutiePlace(routieSpaceIdentifier, placeId);
        return ResponseEntity.noContent().build();
    }
}
