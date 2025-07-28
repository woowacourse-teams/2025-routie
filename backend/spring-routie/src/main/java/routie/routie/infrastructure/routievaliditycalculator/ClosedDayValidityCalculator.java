package routie.routie.infrastructure.routievaliditycalculator;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.springframework.stereotype.Component;
import routie.place.domain.PlaceClosedWeekday;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class ClosedDayValidityCalculator implements ValidityCalculator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_CLOSED_DAY;
    }

    @Override
    public boolean calculateValidity(
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace,
            final ValidationStrategy validationStrategy
    ) {
        return timePeriodByRoutiePlace.entrySet().stream()
                .allMatch(this::isTimePeriodNotClosedDays);
    }

    private boolean isTimePeriodNotClosedDays(final Entry<RoutiePlace, TimePeriod> entry) {
        RoutiePlace routiePlace = entry.getKey();
        TimePeriod period = entry.getValue();

        List<DayOfWeek> closedWeekdays = routiePlace.getPlace().getClosedWeekdays().stream()
                .map(PlaceClosedWeekday::getClosedWeekday)
                .toList();

        DayOfWeek startDay = period.startTime().getDayOfWeek();
        DayOfWeek endDay = period.endTime().getDayOfWeek();

        return !closedWeekdays.contains(startDay) && !closedWeekdays.contains(endDay);
    }
}
