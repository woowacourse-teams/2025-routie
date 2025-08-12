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
                .map(loggingField -> Map.entry(loggingField, loggingField.extract(loggingContext)))
                .filter(entry -> entry.getValue() != null)
                .collect(
                        Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue
                        ));
    }
}
