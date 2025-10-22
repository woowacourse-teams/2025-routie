package routie.business.routie.domain.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class RoutePlaceDeleteEvent extends ApplicationEvent {

    private final Long placeId;
    private final String routieSpaceIdentifier;

    public RoutePlaceDeleteEvent(final Object source, final Long placeId, final String routieSpaceIdentifier) {
        super(source);
        this.placeId = placeId;
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
