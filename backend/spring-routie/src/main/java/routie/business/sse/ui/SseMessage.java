package routie.business.sse.ui;

import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.function.Consumer;

public record SseMessage(
        String eventName,
        Object data
) {

    public static final SseMessage HEALTH_CHECK_MESSAGE = new SseMessage("HEALTH_CHECK", "PING");
    private static final Consumer<IOException> IGNORE_ON_SEND_ERROR = e -> {
    };

    public void sendTo(final SseEmitter emitter) {
        sendTo(emitter, IGNORE_ON_SEND_ERROR);
    }

    public void sendTo(final SseEmitter emitter, final Consumer<IOException> errorHandler) {
        try {
            emitter.send(
                    SseEmitter.event()
                            .name(eventName)
                            .data(data, MediaType.APPLICATION_JSON)
            );
        } catch (final IOException e) {
            errorHandler.accept(e);
        }
    }
}
