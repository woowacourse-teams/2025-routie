package routie.business.routie.ui.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import routie.business.routie.application.RoutieService;
import routie.business.routie.domain.event.RoutieUpdateEvent;
import routie.business.routie.ui.dto.response.RoutieReadResponse;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseMessage;

@Component
@RequiredArgsConstructor
public class RoutieEventBroadcaster {

    private final RoutieService routieService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;

    private SseMessage getRoutieMessage(final String eventName, final String routieSpaceIdentifier) {
        final RoutieReadResponse routieReadResponse = routieService.getRoutie(routieSpaceIdentifier, null, null);
        return new SseMessage(eventName, routieReadResponse);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRoutieUpdateEvent(final RoutieUpdateEvent routieUpdateEvent) {
        final String routieSpaceIdentifier = routieUpdateEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getRoutieMessage("ROUTIE_UPDATED", routieSpaceIdentifier);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @EventListener
    public void handleRoutieSpaceSseEstablishedEvent(
            final RoutieSpaceSseEstablishedEvent routieSpaceSseEstablishedEvent
    ) {
        final String routieSpaceIdentifier = routieSpaceSseEstablishedEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getRoutieMessage("ROUTIE_HISTORY", routieSpaceIdentifier);
        message.sendTo(routieSpaceSseEstablishedEvent.getEmitter());
    }
}
