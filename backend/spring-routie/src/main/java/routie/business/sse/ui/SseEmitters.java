package routie.business.sse.ui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class SseEmitters {

    private final Map<SseToken, SseEmitter> values = new ConcurrentHashMap<>();

    public SseEmitter put(final SseToken token, final long timeout) {
        return values.compute(token, (key, value) -> create(token, timeout));
    }

    public SseEmitter get(final SseToken token) {
        return values.get(token);
    }

    private SseEmitter create(final SseToken token, final long timeout) {
        final SseEmitter emitter = new SseEmitter(timeout);
        emitter.onCompletion(() -> remove(token));
        emitter.onTimeout(() -> remove(token));
        emitter.onError(throwable -> remove(token));
        return emitter;
    }

    public void remove(final SseToken token) {
        values.computeIfPresent(
                token, (key, value) -> {
                    value.complete();
                    return null;
                }
        );
    }

    public boolean isEmpty() {
        return values.isEmpty();
    }

    public void broadcast(final SseMessage message) {
        this.values.forEach((token, emitter) -> message.sendTo(emitter));
    }
}
