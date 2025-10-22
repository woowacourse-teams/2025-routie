package routie.business.routiespace.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import routie.business.routiespace.application.RoutieSpaceService;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseToken;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sse/v1")
public class RoutieSpaceSseControllerV1 {

    private final RoutieSpaceService routieSpaceService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;
    private final ApplicationEventPublisher applicationEventPublisher;

    @GetMapping(
            value = "/routie-spaces/{routieSpaceIdentifier}", produces = MediaType.TEXT_EVENT_STREAM_VALUE
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
