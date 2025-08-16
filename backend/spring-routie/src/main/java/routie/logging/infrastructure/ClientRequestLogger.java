package routie.logging.infrastructure;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import routie.logging.domain.LoggingField;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClientRequestLogger {

    private final ObjectMapper objectMapper;

    public void log(final Map<LoggingField, Object> logData) {
        try {
            addLogDataToContext(logData);
            log.info("");
        } catch (final Exception e) {
            log.warn("failed to log client request");
        } finally {
            clearLogDataFromContext(logData);
        }
    }

    private void addLogDataToContext(final Map<LoggingField, Object> logData) {
        logData.entrySet()
                .stream()
                .filter(entry -> entry.getValue() != null)
                .forEach(entry -> {
                    String fieldName = entry.getKey().getFieldName();
                    String fieldValue = convertToString(entry.getKey(), entry.getValue());
                    MDC.put(fieldName, fieldValue);
                });
    }

    private String convertToString(final LoggingField loggingField, final Object value) {
        if (loggingField.isJsonSerializationRequired()) {
            return serializeToJson(value);
        }
        return String.valueOf(value);
    }

    private String serializeToJson(final Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (final Exception e) {
            log.debug("Failed to serialize object to JSON: {}", value.getClass().getSimpleName());
            return "{\"error\":\"serialization_failed\",\"type\":\"" + value.getClass().getSimpleName() + "\"}";
        }
    }

    private void clearLogDataFromContext(final Map<LoggingField, Object> logData) {
        logData.keySet().forEach(field -> MDC.remove(field.getFieldName()));
    }
}
