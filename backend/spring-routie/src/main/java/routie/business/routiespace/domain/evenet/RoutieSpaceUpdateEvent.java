package routie.business.routiespace.domain.evenet;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class RoutieSpaceUpdateEvent extends ApplicationEvent {

    private final String routieSpaceIdentifier;

    public RoutieSpaceUpdateEvent(final Object source, final String routieSpaceIdentifier) {
        super(source);
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
