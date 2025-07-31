package routie.routie.infrastructure.routievalidator;

import java.time.DayOfWeek;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.place.domain.PlaceClosedDayOfWeek;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

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
        final TimePeriods timePeriods = validationContext.timePeriods();
        return timePeriods.routiePlaces().stream()
                .allMatch(routiePlace -> isTimePeriodNotClosedDays(
                        routiePlace,
                        timePeriods.getBy(routiePlace)
                ));
    }

    private boolean isTimePeriodNotClosedDays(final RoutiePlace routiePlace, final TimePeriod timePeriod) {
        List<DayOfWeek> closedDayOfWeeks = routiePlace.getPlace().getPlaceClosedDayOfWeeks().stream()
                .map(PlaceClosedDayOfWeek::getClosedDayOfWeek)
                .toList();

        DayOfWeek startDay = timePeriod.startTime().getDayOfWeek();
        DayOfWeek endDay = timePeriod.endTime().getDayOfWeek();

        return !closedDayOfWeeks.contains(startDay) && !closedDayOfWeeks.contains(endDay);
    }
}
