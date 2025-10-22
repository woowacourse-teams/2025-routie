package routie.business.sse.ui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class SseEmitters {

    private final Set<SseEmitter> values = ConcurrentHashMap.newKeySet();

    public SseEmitter put(final long timeout) {
        final SseEmitter emitter = create(timeout);
        values.add(emitter);
        return emitter;
    }

    private SseEmitter create(final long timeout) {
        final SseEmitter emitter = new SseEmitter(timeout);
        emitter.onCompletion(() -> remove(emitter));
        emitter.onTimeout(() -> remove(emitter));
        emitter.onError(throwable -> remove(emitter));
        return emitter;
    }

    public void remove(final SseEmitter emitter) {
        values.remove(emitter);
    }

    public void broadcast(final SseMessage message) {
        this.values.forEach(message::sendTo);
    }
}
