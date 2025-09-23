package routie.global.logging.domain;

import java.util.Set;

public interface LoggingStrategy {
    Set<LoggingField> getLoggingFields();
}
