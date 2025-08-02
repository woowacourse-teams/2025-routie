package routie.routie.infrastructure.routievalidator;

import java.time.DayOfWeek;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.place.domain.PlaceClosedDayOfWeek;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class ClosedDayValidator implements RoutieValidator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_CLOSED_DAY;
    }

    @Override
    public ValidationResult validate(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        List<TimePeriod> timePeriods = validationContext.timePeriods().orderedList();

        return ValidationResult.withoutRoutiePlaces(
                timePeriods.stream()
                        .allMatch(this::isTimePeriodNotClosedDays),
                validationStrategy
        );
    }

    private boolean isTimePeriodNotClosedDays(final TimePeriod timePeriod) {
        List<DayOfWeek> closedDayOfWeeks = timePeriod.routiePlace().getPlace().getPlaceClosedDayOfWeeks().stream()
                .map(PlaceClosedDayOfWeek::getClosedDayOfWeek)
                .toList();

        DayOfWeek startDay = timePeriod.startTime().getDayOfWeek();
        DayOfWeek endDay = timePeriod.endTime().getDayOfWeek();

        return !closedDayOfWeeks.contains(startDay) && !closedDayOfWeeks.contains(endDay);
    }
}
