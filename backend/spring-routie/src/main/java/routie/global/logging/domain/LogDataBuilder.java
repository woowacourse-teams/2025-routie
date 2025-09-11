package routie.global.logging.domain;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LogDataBuilder {

    private final LoggingStrategy loggingStrategy;

    public Map<LoggingField, Object> buildLogData(final LoggingContext loggingContext) {
        return loggingStrategy.getLoggingFields()
                .stream()
                .map(field -> extractAsEntry(field, loggingContext))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue
                ));
    }

    private Optional<Map.Entry<LoggingField, Object>> extractAsEntry(
            final LoggingField field,
            final LoggingContext context
    ) {
        return field.extract(context)
                .map(value -> Map.entry(field, value));
    }
}
