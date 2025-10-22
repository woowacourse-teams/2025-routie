package routie.business.place.ui.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import routie.business.place.application.PlaceService;
import routie.business.place.domain.event.PlaceCreateEvent;
import routie.business.place.domain.event.PlaceDeleteEvent;
import routie.business.place.domain.event.PlaceUpdateEvent;
import routie.business.place.ui.dto.response.PlaceListResponseV3;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseMessage;

@Service
@RequiredArgsConstructor
public class PlaceEventBroadcaster {

    private final PlaceService placeService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;

    private SseMessage getAllPlacesSseMessage(final String eventName, final String routieSpaceIdentifier) {
        final PlaceListResponseV3 placeListResponse = placeService.readPlacesV3(routieSpaceIdentifier);
        return new SseMessage(eventName, placeListResponse);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceUpdateEvent(final PlaceUpdateEvent placeUpdateEvent) {
        final String routieSpaceIdentifier = placeUpdateEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getAllPlacesSseMessage("PLACE_UPDATED", routieSpaceIdentifier);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceDeleteEvent(final PlaceDeleteEvent placeDeleteEvent) {
        final String routieSpaceIdentifier = placeDeleteEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getAllPlacesSseMessage("PLACE_DELETED", routieSpaceIdentifier);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceCreateEvent(final PlaceCreateEvent placeCreateEvent) {
        final String routieSpaceIdentifier = placeCreateEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getAllPlacesSseMessage("PLACE_CREATED", routieSpaceIdentifier);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @EventListener
    public void handleRoutieSpaceSseEstablishedEvent(
            final RoutieSpaceSseEstablishedEvent routieSpaceSseEstablishedEvent
    ) {
        final String routieSpaceIdentifier = routieSpaceSseEstablishedEvent.getRoutieSpaceIdentifier();
        final SseMessage message = getAllPlacesSseMessage("PLACE_HISTORY", routieSpaceIdentifier);
        message.sendTo(routieSpaceSseEstablishedEvent.getEmitter());
    }
}
