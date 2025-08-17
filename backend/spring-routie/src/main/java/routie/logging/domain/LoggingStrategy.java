package routie.logging.domain;

import java.util.Set;

public interface LoggingStrategy {
    Set<LoggingField> getLoggingFields();
}
