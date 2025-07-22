package routie.routiespace.controller;

import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.routiespace.controller.dto.request.UpdateRoutieSpaceNameRequest;
import routie.routiespace.controller.dto.response.UpdateRoutieSpaceNameResponse;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.service.RoutieSpaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces")
public class RoutieSpaceController {

    private final RoutieSpaceService routieSpaceService;

    @PostMapping
    public ResponseEntity<Void> create() {
        RoutieSpace routieSpace = routieSpaceService.addRoutieSpace();
        URI location = URI.create(String.format("/routie-spaces/%s", routieSpace.getIdentifier()));

        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/{routieSpaceIdentifier}/name")
    public ResponseEntity<UpdateRoutieSpaceNameResponse> updateName(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final UpdateRoutieSpaceNameRequest updateRoutieSpaceNameRequest
    ) {
        UpdateRoutieSpaceNameResponse updateRoutieSpaceNameResponse = routieSpaceService.updateRoutieSpaceName(
                routieSpaceIdentifier,
                updateRoutieSpaceNameRequest
        );

        return ResponseEntity.ok(updateRoutieSpaceNameResponse);
    }
}
