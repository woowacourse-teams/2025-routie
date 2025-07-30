package routie.routie.infrastructure.routievalidator;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map.Entry;
import org.springframework.stereotype.Component;
import routie.place.domain.PlaceClosedDayOfWeek;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class ClosedDayValidator implements RoutieValidator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_CLOSED_DAY;
    }

    @Override
    public boolean isValid(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return validationContext.timePeriodByRoutiePlace().entrySet().stream()
                .allMatch(this::isTimePeriodNotClosedDays);
    }

    private boolean isTimePeriodNotClosedDays(final Entry<RoutiePlace, TimePeriod> entry) {
        RoutiePlace routiePlace = entry.getKey();
        TimePeriod period = entry.getValue();

        List<DayOfWeek> closedDayOfWeeks = routiePlace.getPlace().getPlaceClosedDayOfWeeks().stream()
                .map(PlaceClosedDayOfWeek::getClosedDayOfWeek)
                .toList();

        DayOfWeek startDay = period.startTime().getDayOfWeek();
        DayOfWeek endDay = period.endTime().getDayOfWeek();

        return !closedDayOfWeeks.contains(startDay) && !closedDayOfWeeks.contains(endDay);
    }
}
