package routie.logging.domain;

import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LogDataBuilder {

    private final LoggingStrategy loggingStrategy;

    public Map<LoggingField, Object> buildLogData(final LoggingContext loggingContext) {
        return loggingStrategy.getLoggingFields()
                .stream()
                .filter(loggingField -> loggingField.extract(loggingContext) != null)
                .collect(
                        Collectors.toMap(
                                loggingField -> loggingField,
                                loggingField -> loggingField.extract(loggingContext)
                        ));
    }
}
