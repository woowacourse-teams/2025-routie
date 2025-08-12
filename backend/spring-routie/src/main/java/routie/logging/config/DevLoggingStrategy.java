package routie.logging.config;

import static routie.logging.domain.LoggingField.CLIENT_IP;
import static routie.logging.domain.LoggingField.HANDLER_METHOD;
import static routie.logging.domain.LoggingField.HANDLER_PARAMS;
import static routie.logging.domain.LoggingField.HTTP_METHOD;
import static routie.logging.domain.LoggingField.REQUEST_RESULT;
import static routie.logging.domain.LoggingField.RESPONSE_TIME_MS;
import static routie.logging.domain.LoggingField.URL;

import java.util.Set;
import routie.logging.domain.LoggingField;
import routie.logging.domain.LoggingStrategy;

public class DevLoggingStrategy implements LoggingStrategy {

    @Override
    public Set<LoggingField> getLoggingFields() {
        return Set.of(
                HTTP_METHOD,
                URL,
                CLIENT_IP,
                RESPONSE_TIME_MS,
                HANDLER_METHOD,
                HANDLER_PARAMS,
                REQUEST_RESULT
        );
    }
}
