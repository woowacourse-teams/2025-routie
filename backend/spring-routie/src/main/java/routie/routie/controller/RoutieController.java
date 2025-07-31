package routie.routie.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieTimeValidationResponse;
import routie.routie.service.RoutieService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces/{routieSpaceIdentifier}/routie")
public class RoutieController {

    private final RoutieService routieService;

    @GetMapping
    public ResponseEntity<RoutieReadResponse> readRoutie(
            @PathVariable final String routieSpaceIdentifier,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDateTime
    ) {
        return ResponseEntity.ok(routieService.getRoutie(routieSpaceIdentifier, startDateTime));
    }

    @PatchMapping
    public ResponseEntity<Void> updateRoutie(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody final RoutieUpdateRequest routieUpdateRequest
    ) {
        routieService.modifyRoutie(routieSpaceIdentifier, routieUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validity")
    public ResponseEntity<RoutieTimeValidationResponse> validateRoutieTime(
            @PathVariable final String routieSpaceIdentifier,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime endDateTime
    ) {
        RoutieTimeValidationResponse routieTimeValidationResponse = routieService.validateRoutie(
                routieSpaceIdentifier,
                startDateTime,
                endDateTime
        );
        return ResponseEntity.ok(routieTimeValidationResponse);
    }
}
