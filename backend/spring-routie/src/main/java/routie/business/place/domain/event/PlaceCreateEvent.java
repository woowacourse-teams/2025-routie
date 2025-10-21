package routie.business.place.domain.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PlaceCreateEvent extends ApplicationEvent {

    private final String routieSpaceIdentifier;

    public PlaceCreateEvent(final Object source, final String routieSpaceIdentifier) {
        super(source);
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
