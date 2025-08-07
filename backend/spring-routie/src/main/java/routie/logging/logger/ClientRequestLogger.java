package routie.logging.logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClientRequestLogger {

    private final ObjectMapper objectMapper;

    public void log(final Map<String, Object> logData) {
        try {
            logData.forEach((key, value) -> {
                if (value != null) {
                    MDC.put(key, convertToString(key, value));
                }
            });
            log.info("");
        } finally {
            MDC.clear();
        }
    }

    private String convertToString(final String key, final Object value) {
        if (key.equals("handlerParams")) {
            try {
                return objectMapper.writeValueAsString(value);
            } catch (final Exception e) {
                return "[]";
            }
        }
        return String.valueOf(value);
    }
}
