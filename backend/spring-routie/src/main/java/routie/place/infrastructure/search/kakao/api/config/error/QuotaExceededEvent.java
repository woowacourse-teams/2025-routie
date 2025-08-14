package routie.place.infrastructure.search.kakao.api.config.error;

import org.springframework.context.ApplicationEvent;

public class QuotaExceededEvent extends ApplicationEvent {

    public QuotaExceededEvent(final Object source) {
        super(source);
    }
}
