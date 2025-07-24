package routie.routie.controller;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieTimeValidationResponse;
import routie.routie.controller.dto.response.RoutieUpdateResponse;
import routie.routie.service.RoutieService;

@RestController
@RequestMapping("/routies")
@RequiredArgsConstructor
public class RoutieController {

    private final RoutieService routieService;

    @GetMapping("/{id}")
    public ResponseEntity<RoutieReadResponse> readRoutie(
            @PathVariable final Long id
    ) {
        return ResponseEntity.ok(routieService.getRoutie(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RoutieUpdateResponse> updateRoutie(
            @PathVariable final Long id,
            @RequestBody final RoutieUpdateRequest routieUpdateRequest
    ) {
        return ResponseEntity.ok(routieService.modifyRoutie(id, routieUpdateRequest));
    }

    @GetMapping("/routies/{routieId}/validity")
    public ResponseEntity<RoutieTimeValidationResponse> validateRoutieTime(
            @PathVariable final Long routieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime endDateTime
    ) {
        RoutieTimeValidationResponse result = routieService.validateRoutie(routieId, startDateTime, endDateTime);
        return ResponseEntity.ok(result);
    }
}
