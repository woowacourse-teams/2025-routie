package routie.routie.infrastructure.routievaliditycalculator;

import java.time.LocalTime;
import java.util.Map;
import org.springframework.stereotype.Component;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class BreaktimeValidityCalculator implements ValidityCalculator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_DURING_BREAKTIME;
    }

    @Override
    public boolean calculateValidity(
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace,
            final ValidationStrategy validationStrategy
    ) {
        return timePeriodByRoutiePlace.entrySet().stream()
                .allMatch(entry -> isWithoutBreaktime(
                        entry.getKey().getPlace(),
                        entry.getValue()
                ));
    }

    private boolean isWithoutBreaktime(final Place place, final TimePeriod timePeriod) {
        final LocalTime breakStartAt = place.getBreakStartAt();
        final LocalTime breakEndAt = place.getBreakEndAt();

        if (breakStartAt == null || breakEndAt == null) {
            return true;
        }

        final LocalTime visitStartTime = timePeriod.startTime().toLocalTime();
        final LocalTime visitEndTime = timePeriod.endTime().toLocalTime();

        return isValidDepartureTime(visitStartTime, breakStartAt, breakEndAt) &&
                isValidArrivalTime(visitEndTime, breakStartAt, breakEndAt);
    }

    private boolean isValidDepartureTime(
            final LocalTime departureTime,
            final LocalTime breakStart,
            final LocalTime breakEnd
    ) {
        return departureTime.isBefore(breakStart) ||
                departureTime.equals(breakStart) ||
                departureTime.isAfter(breakEnd);
    }

    private boolean isValidArrivalTime(
            final LocalTime arrivalTime,
            final LocalTime breakStart,
            final LocalTime breakEnd
    ) {
        return arrivalTime.isBefore(breakStart) ||
                arrivalTime.equals(breakEnd) ||
                arrivalTime.isAfter(breakEnd);
    }
}
