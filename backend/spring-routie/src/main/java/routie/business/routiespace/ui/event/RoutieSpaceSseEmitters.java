package routie.business.routiespace.ui.event;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import routie.business.sse.ui.SseEmitters;
import routie.business.sse.ui.SseMessage;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RoutieSpaceSseEmitters {

    private static final long SECOND = 1000L;
    private static final long MINUTE = 60 * SECOND;
    private static final long HEALTH_CHECK_INTERVAL = 10 * SECOND;
    private static final long SSE_EMITTER_TIMEOUT = 60 * MINUTE;

    private final Map<String, SseEmitters> emitters = new ConcurrentHashMap<>();

    public SseEmitter put(final String routieSpaceIdentifier) {
        return emitters.computeIfAbsent(
                routieSpaceIdentifier,
                identifier -> new SseEmitters()
        ).put(SSE_EMITTER_TIMEOUT);
    }

    public void broadcast(final String routieSpaceIdentifier, final SseMessage message) {
        Optional.ofNullable(emitters.get(routieSpaceIdentifier))
                .ifPresent(sseEmitter -> sseEmitter.broadcast(message));
    }

    private void broadcast(final SseMessage message) {
        emitters.values()
                .forEach(sseEmitters -> sseEmitters.broadcast(message));
    }

    @Scheduled(fixedRate = HEALTH_CHECK_INTERVAL)
    public void healthCheck() {
        broadcast(SseMessage.HEALTH_CHECK_MESSAGE);
    }
}
