package routie.business.routiespace.ui.v2;

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
import routie.business.authentication.ui.argument.annotation.AuthenticatedUser;
import routie.business.participant.domain.User;
import routie.business.routiespace.application.RoutieSpaceService;
import routie.business.routiespace.ui.dto.request.RoutieSpaceUpdateRequest;
import routie.business.routiespace.ui.dto.response.RoutieSpaceCreateResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceReadResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceUpdateResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v2/routie-spaces")
public class RoutieSpaceControllerV2 {

    private final RoutieSpaceService routieSpaceService;

    @PostMapping
    public ResponseEntity<RoutieSpaceCreateResponse> createRoutieSpace(
            @AuthenticatedUser final User user
    ) {
        RoutieSpaceCreateResponse routieSpaceCreateResponse = routieSpaceService.addRoutieSpaceV2(user);
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
            @RequestBody @Valid final RoutieSpaceUpdateRequest routieSpaceUpdateRequest,
            @AuthenticatedUser final User user
    ) {
        RoutieSpaceUpdateResponse routieSpaceUpdateResponse = routieSpaceService.modifyRoutieSpaceV2(
                routieSpaceIdentifier,
                routieSpaceUpdateRequest,
                user
        );

        return ResponseEntity.ok(routieSpaceUpdateResponse);
    }
}
