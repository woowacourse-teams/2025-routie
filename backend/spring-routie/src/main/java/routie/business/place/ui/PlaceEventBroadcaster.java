package routie.business.place.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import routie.business.place.application.PlaceService;
import routie.business.place.domain.event.PlaceCreateEvent;
import routie.business.place.domain.event.PlaceDeleteEvent;
import routie.business.place.domain.event.PlaceUpdateEvent;
import routie.business.place.ui.dto.event.SsePlaceCreateResponse;
import routie.business.place.ui.dto.event.SsePlaceDeleteResponse;
import routie.business.place.ui.dto.event.SsePlaceHistoryResponse;
import routie.business.place.ui.dto.event.SsePlaceUpdateResponse;
import routie.business.routiespace.ui.event.RoutieSpaceSseEmitters;
import routie.business.routiespace.ui.event.RoutieSpaceSseEstablishedEvent;
import routie.business.sse.ui.SseMessage;

@Component
@RequiredArgsConstructor
public class PlaceEventBroadcaster {

    private final PlaceService placeService;
    private final RoutieSpaceSseEmitters routieSpaceSseEmitters;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceUpdateEvent(final PlaceUpdateEvent placeUpdateEvent) {
        final String routieSpaceIdentifier = placeUpdateEvent.getRoutieSpaceIdentifier();
        final SsePlaceUpdateResponse placeUpdateResponse = SsePlaceUpdateResponse.createWithPlaceListResponseV2(
                placeUpdateEvent.getPlaceId(),
                placeService.readPlacesV3(routieSpaceIdentifier)
        );
        final SseMessage message = new SseMessage("PLACE_UPDATED", placeUpdateResponse);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceDeleteEvent(final PlaceDeleteEvent placeDeleteEvent) {
        final String routieSpaceIdentifier = placeDeleteEvent.getRoutieSpaceIdentifier();
        final SsePlaceDeleteResponse placeDeleteResponse = SsePlaceDeleteResponse.createWithPlaceListResponseV2(
                placeDeleteEvent.getPlaceId(),
                placeService.readPlacesV3(routieSpaceIdentifier)
        );
        final SseMessage message = new SseMessage("PLACE_DELETED", placeDeleteResponse);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePlaceCreateEvent(final PlaceCreateEvent placeCreateEvent) {
        final String routieSpaceIdentifier = placeCreateEvent.getRoutieSpaceIdentifier();
        final SsePlaceCreateResponse placeCreateResponse = SsePlaceCreateResponse.createWithPlaceListResponseV2(
                placeCreateEvent.getPlaceId(),
                placeService.readPlacesV3(routieSpaceIdentifier)
        );
        final SseMessage message = new SseMessage("PLACE_CREATED", placeCreateResponse);
        routieSpaceSseEmitters.broadcast(routieSpaceIdentifier, message);
    }

    @Async
    @EventListener
    public void handleRoutieSpaceSseEstablishedEvent(
            final RoutieSpaceSseEstablishedEvent routieSpaceSseEstablishedEvent
    ) {
        final String routieSpaceIdentifier = routieSpaceSseEstablishedEvent.getRoutieSpaceIdentifier();
        final SsePlaceHistoryResponse placeHistoryResponse = SsePlaceHistoryResponse.from(
                placeService.readPlacesV3(routieSpaceIdentifier)
        );
        final SseMessage message = new SseMessage("PLACE_HISTORY", placeHistoryResponse);
        message.sendTo(routieSpaceSseEstablishedEvent.getEmitter());
    }
}
