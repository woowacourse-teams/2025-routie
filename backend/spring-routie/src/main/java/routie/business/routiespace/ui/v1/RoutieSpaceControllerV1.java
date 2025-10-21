package routie.business.routiespace.ui.v1;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import routie.business.authentication.domain.Role;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.participant.domain.User;
import routie.business.routiespace.application.RoutieSpaceService;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.ui.dto.request.RoutieSpaceUpdateRequest;
import routie.business.routiespace.ui.dto.response.RoutieSpaceCreateResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceListResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceReadResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceUpdateResponse;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseToken;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
public class RoutieSpaceControllerV1 {

    private final RoutieSpaceService routieSpaceService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;
    private final ApplicationEventPublisher applicationEventPublisher;

    @PostMapping("/routie-spaces")
    public ResponseEntity<RoutieSpaceCreateResponse> createRoutieSpace() {
        final RoutieSpaceCreateResponse routieSpaceCreateResponse = routieSpaceService.addRoutieSpace();

        return ResponseEntity.ok(routieSpaceCreateResponse);
    }

    @GetMapping("/routie-spaces/{routieSpaceIdentifier}")
    public ResponseEntity<RoutieSpaceReadResponse> readRoutieSpace(
            @PathVariable final String routieSpaceIdentifier
    ) {
        final RoutieSpaceReadResponse routieSpaceReadResponse = routieSpaceService.getRoutieSpace(
                routieSpaceIdentifier);
        return ResponseEntity.ok(routieSpaceReadResponse);
    }

    @GetMapping("/my-routie-spaces")
    public ResponseEntity<RoutieSpaceListResponse> readRoutieSpaces(
            @AuthenticatedParticipant(roles = Role.USER) final User user
    ) {
        final RoutieSpaceListResponse routieSpaceListResponse = routieSpaceService.getRoutieSpaces(user);

        return ResponseEntity.ok(routieSpaceListResponse);
    }

    @PatchMapping("/routie-spaces/{routieSpaceIdentifier}")
    public ResponseEntity<RoutieSpaceUpdateResponse> updateRoutieSpace(
            @PathVariable final String routieSpaceIdentifier,
            @RequestBody @Valid final RoutieSpaceUpdateRequest routieSpaceUpdateRequest
    ) {
        final RoutieSpaceUpdateResponse routieSpaceUpdateResponse = routieSpaceService.modifyRoutieSpace(
                routieSpaceIdentifier,
                routieSpaceUpdateRequest
        );

        return ResponseEntity.ok(routieSpaceUpdateResponse);
    }

    @DeleteMapping("/routie-spaces/{routieSpaceIdentifier}")
    public ResponseEntity<Void> deleteRoutieSpace(
            @PathVariable final String routieSpaceIdentifier,
            @AuthenticatedParticipant(roles = Role.USER) final User user
    ) {
        routieSpaceService.deleteRoutieSpace(routieSpaceIdentifier, user);

        return ResponseEntity.noContent().build();
    }

    @GetMapping(
            value = "/routie-spaces/{routieSpaceIdentifier}/server-sent-events/subscriptions",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter subscribe(
            @RequestParam("token") final String token,
            @PathVariable final String routieSpaceIdentifier
    ) {
        final RoutieSpace routieSpace = routieSpaceService.getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        final SseEmitter emitter = routieSpaceSseEmitters.put(routieSpace, new SseToken(token));
        applicationEventPublisher.publishEvent(
                new RoutieSpaceSseEstablishedEvent(this, emitter, routieSpaceIdentifier)
        );
        return emitter;
    }
}
