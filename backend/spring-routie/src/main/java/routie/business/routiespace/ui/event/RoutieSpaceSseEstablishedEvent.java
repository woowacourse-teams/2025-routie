package routie.business.routiespace.ui.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Getter
public class RoutieSpaceSseEstablishedEvent extends ApplicationEvent {

    private final SseEmitter emitter;
    private final String routieSpaceIdentifier;

    public RoutieSpaceSseEstablishedEvent(
            final Object source,
            final SseEmitter emitter,
            final String routieSpaceIdentifier
    ) {
        super(source);
        this.emitter = emitter;
        this.routieSpaceIdentifier = routieSpaceIdentifier;
    }
}
