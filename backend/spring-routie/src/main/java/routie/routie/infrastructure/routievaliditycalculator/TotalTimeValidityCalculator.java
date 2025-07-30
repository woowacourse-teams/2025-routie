package routie.routie.infrastructure.routievaliditycalculator;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.springframework.stereotype.Component;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.ValidationContext;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class TotalTimeValidityCalculator implements ValidityCalculator {

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_WITHIN_TOTAL_TIME;
    }

    @Override
    public boolean calculateValidity(final ValidationContext validationContext,
                                     final ValidationStrategy validationStrategy) {
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace = validationContext.timePeriodByRoutiePlace();

        if (timePeriodByRoutiePlace.isEmpty()) {
            return true;
        }

        return calculateTotalTimeValidity(
                validationContext.startDateTime(),
                validationContext.endDateTime(),
                timePeriodByRoutiePlace
        );
    }

    private boolean calculateTotalTimeValidity(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
    ) {
        List<Entry<RoutiePlace, TimePeriod>> sortedEntries = timePeriodByRoutiePlace.entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getKey().getSequence()))
                .toList();

        if (sortedEntries.isEmpty()) {
            return true;
        }

        LocalDateTime firstPeriodStartTime = sortedEntries.getFirst().getValue().startTime();
        LocalDateTime lastPeriodEndTime = sortedEntries.getLast().getValue().endTime();

        return !firstPeriodStartTime.isBefore(startDateTime) && !lastPeriodEndTime.isAfter(endDateTime);
    }
}
