package routie.business.routiespace.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import routie.business.routiespace.application.RoutieSpaceService;
import routie.business.routiespace.domain.evenet.RoutieSpaceUpdateEvent;
import routie.business.routiespace.ui.dto.event.SseRoutieSpaceHistoryResponse;
import routie.business.routiespace.ui.dto.event.SseRoutieSpaceUpdateResponse;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseMessage;

@Component
@RequiredArgsConstructor
public class RoutieSpaceEventBroadcaster {

    private final RoutieSpaceService routieSpaceService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRoutieSpaceUpdateEvent(final RoutieSpaceUpdateEvent routieSpaceUpdateEvent) {
        final String routieSpaceIdentifier = routieSpaceUpdateEvent.getRoutieSpaceIdentifier();
        final SseRoutieSpaceUpdateResponse response = new SseRoutieSpaceUpdateResponse(
                routieSpaceService.getRoutieSpace(routieSpaceIdentifier).name()
        );
        final SseMessage message = new SseMessage("ROUTIE_SPACE_UPDATED", response);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @EventListener
    public void handleRoutieSpaceSseEstablishedEvent(
            final RoutieSpaceSseEstablishedEvent routieSpaceSseEstablishedEvent
    ) {
        final String routieSpaceIdentifier = routieSpaceSseEstablishedEvent.getRoutieSpaceIdentifier();
        final SseRoutieSpaceHistoryResponse response = new SseRoutieSpaceHistoryResponse(
                routieSpaceService.getRoutieSpace(routieSpaceIdentifier).name()
        );
        final SseMessage message = new SseMessage("ROUTIE_SPACE_HISTORY", response);
        message.sendTo(routieSpaceSseEstablishedEvent.getEmitter());
    }
}
