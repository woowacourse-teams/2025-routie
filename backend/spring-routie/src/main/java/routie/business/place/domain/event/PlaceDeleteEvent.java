package routie.business.place.domain.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PlaceDeleteEvent extends ApplicationEvent {

    private final Long placeId;
    private final String routieSpaceIdentifier;

    public PlaceDeleteEvent(final Object source, final Long placeId, final String routieSpaceIdentifier) {
        super(source);
        this.placeId = placeId;
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
