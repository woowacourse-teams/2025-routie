package routie.business.routie.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import routie.business.routie.application.RoutieService;
import routie.business.routie.domain.event.RoutePlaceCreateEvent;
import routie.business.routie.domain.event.RoutePlaceDeleteEvent;
import routie.business.routie.domain.event.RoutieUpdateEvent;
import routie.business.routie.ui.dto.sse.SseRoutieHistoryResponse;
import routie.business.routie.ui.dto.sse.SseRoutiePlaceCreateResponse;
import routie.business.routie.ui.dto.sse.SseRoutiePlaceDeleteResponse;
import routie.business.routie.ui.dto.sse.SseRoutieUpdateResponse;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseMessage;

@Component
@RequiredArgsConstructor
public class RoutieEventBroadcaster {

    private final RoutieService routieService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRoutieUpdateEvent(final RoutieUpdateEvent routieUpdateEvent) {
        final String routieSpaceIdentifier = routieUpdateEvent.getRoutieSpaceIdentifier();
        final SseRoutieUpdateResponse response = SseRoutieUpdateResponse.from(
                routieService.getRoutie(routieSpaceIdentifier, null, null)
        );
        final SseMessage message = new SseMessage("ROUTIE_UPDATED", response);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRoutePlaceCreateEvent(final RoutePlaceCreateEvent routieUpdateEvent) {
        final String routieSpaceIdentifier = routieUpdateEvent.getRoutieSpaceIdentifier();
        final SseRoutiePlaceCreateResponse response = SseRoutiePlaceCreateResponse.createWithRoutieReadResponse(
                routieUpdateEvent.getPlaceId(),
                routieService.getRoutie(routieSpaceIdentifier, null, null)
        );
        final SseMessage message = new SseMessage("ROUTIE_PLACE_CREATED", response);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleRoutePlaceDeleteEvent(final RoutePlaceDeleteEvent routieUpdateEvent) {
        final String routieSpaceIdentifier = routieUpdateEvent.getRoutieSpaceIdentifier();
        final SseRoutiePlaceDeleteResponse response = SseRoutiePlaceDeleteResponse.createWithRoutieReadResponse(
                routieUpdateEvent.getPlaceId(),
                routieService.getRoutie(routieSpaceIdentifier, null, null)
        );
        final SseMessage message = new SseMessage("ROUTIE_PLACE_DELETED", response);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @EventListener
    public void handleRoutieSpaceSseEstablishedEvent(
            final RoutieSpaceSseEstablishedEvent routieSpaceSseEstablishedEvent
    ) {
        final String routieSpaceIdentifier = routieSpaceSseEstablishedEvent.getRoutieSpaceIdentifier();
        final SseRoutieHistoryResponse response = SseRoutieHistoryResponse.from(
                routieService.getRoutie(routieSpaceIdentifier, null, null)
        );
        final SseMessage message = new SseMessage("ROUTIE_HISTORY", response);
        message.sendTo(routieSpaceSseEstablishedEvent.getEmitter());
    }
}
