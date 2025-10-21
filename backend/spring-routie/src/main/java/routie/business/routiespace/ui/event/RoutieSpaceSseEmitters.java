package routie.business.routiespace.ui.event;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.sse.ui.SseEmitters;
import routie.business.sse.ui.SseMessage;
import routie.business.sse.ui.SseToken;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

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

    public SseEmitter get(final String routieSpaceIdentifier, final SseToken token) {
        final SseEmitters sseEmitters = emitters.get(routieSpaceIdentifier);
        return Optional.ofNullable(sseEmitters)
                .map(emitters -> emitters.get(token))
                .orElseThrow(() -> new BusinessException(ErrorCode.SSE_EMITTER_NOT_FOUND));
    }

    public SseEmitter put(final RoutieSpace routieSpace, final SseToken token) {
        return emitters.computeIfAbsent(
                        routieSpace.getIdentifier(),
                        routieSpaceIdentifier -> new SseEmitters()
                )
                .put(token, SSE_EMITTER_TIMEOUT);
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
