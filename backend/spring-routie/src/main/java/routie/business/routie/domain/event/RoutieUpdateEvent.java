package routie.business.routie.domain.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class RoutieUpdateEvent extends ApplicationEvent {

    private final String routieSpaceIdentifier;

    public RoutieUpdateEvent(final Object source, final String routieSpaceIdentifier) {
        super(source);
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
