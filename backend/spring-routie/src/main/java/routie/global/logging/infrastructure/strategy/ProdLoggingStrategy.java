package routie.global.logging.infrastructure.strategy;

import static routie.global.logging.domain.LoggingField.CLIENT_IP;
import static routie.global.logging.domain.LoggingField.HTTP_METHOD;
import static routie.global.logging.domain.LoggingField.REQUEST_RESULT;
import static routie.global.logging.domain.LoggingField.RESPONSE_TIME_MS;
import static routie.global.logging.domain.LoggingField.URL;

import java.util.Set;
import routie.global.logging.domain.LoggingField;
import routie.global.logging.domain.LoggingStrategy;

public class ProdLoggingStrategy implements LoggingStrategy {

    @Override
    public Set<LoggingField> getLoggingFields() {
        return Set.of(
                HTTP_METHOD,
                URL,
                CLIENT_IP,
                RESPONSE_TIME_MS,
                REQUEST_RESULT
        );
    }
}
