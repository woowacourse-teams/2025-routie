package routie.global.logging.infrastructure;

import java.util.UUID;
import org.slf4j.MDC;

public final class TraceIdHolder {

    public static final String TRACE_ID_KEY = "traceId";

    private TraceIdHolder() {
    }

    public static void setTraceId() {
        if (MDC.get(TRACE_ID_KEY) == null) {
            MDC.put(TRACE_ID_KEY, generateTraceId());
        }
    }

    public static String getTraceId() {
        return MDC.get(TRACE_ID_KEY);
    }

    public static void clearTraceId() {
        MDC.remove(TRACE_ID_KEY);
    }

    private static String generateTraceId() {
        return UUID.randomUUID().toString();
    }
}
