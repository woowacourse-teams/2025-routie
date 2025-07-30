package routie.routiespace.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.routiespace.controller.dto.request.RoutieSpaceUpdateRequest;
import routie.routiespace.controller.dto.response.RoutieSpaceCreateResponse;
import routie.routiespace.controller.dto.response.RoutieSpaceReadResponse;
import routie.routiespace.controller.dto.response.RoutieSpaceUpdateResponse;
import routie.routiespace.service.RoutieSpaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces")
public class RoutieSpaceController {

    private final RoutieSpaceService routieSpaceService;

    @PostMapping
    public ResponseEntity<RoutieSpaceCreateResponse> createRoutieSpace() {
        RoutieSpaceCreateResponse routieSpaceCreateResponse = routieSpaceService.addRoutieSpace();
        return ResponseEntity.ok(routieSpaceCreateResponse);
    }

    @GetMapping("/{routieSpaceIdentifier}")
    public ResponseEntity<RoutieSpaceReadResponse> readRoutieSpace(
            @PathVariable final String routieSpaceIdentifier
    ) {
        RoutieSpaceReadResponse routieSpaceReadResponse = routieSpaceService.getRoutieSpace(routieSpaceIdentifier);
        return ResponseEntity.ok(routieSpaceReadResponse);
    }

    @PatchMapping("/{routieSpaceIdentifier}")
    public ResponseEntity<RoutieSpaceUpdateResponse> updateRoutieSpace(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final RoutieSpaceUpdateRequest routieSpaceUpdateRequest
    ) {
        RoutieSpaceUpdateResponse routieSpaceUpdateResponse = routieSpaceService.modifyRoutieSpace(
                routieSpaceIdentifier,
                routieSpaceUpdateRequest
        );

        return ResponseEntity.ok(routieSpaceUpdateResponse);
    }
}
