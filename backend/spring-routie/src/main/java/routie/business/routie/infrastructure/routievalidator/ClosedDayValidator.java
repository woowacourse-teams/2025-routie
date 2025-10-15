package routie.business.routie.infrastructure.routievalidator;

import java.time.DayOfWeek;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.routievalidator.RoutieValidator;
import routie.business.routie.domain.routievalidator.ValidationContext;
import routie.business.routie.domain.routievalidator.ValidationResult;
import routie.business.routie.domain.routievalidator.ValidationStrategy;
import routie.business.routie.domain.timeperiod.TimePeriod;

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
        final List<TimePeriod> timePeriods = validationContext.timePeriods().orderedList();

        final List<RoutiePlace> invalidRoutiePlaces = timePeriods.stream()
                .filter(timePeriod -> !this.isTimePeriodNotClosedDays(timePeriod))
                .map(TimePeriod::routiePlace)
                .toList();

        return new ValidationResult(
                invalidRoutiePlaces.isEmpty(),
                validationStrategy,
                invalidRoutiePlaces
        );
    }


    private boolean isTimePeriodNotClosedDays(final TimePeriod timePeriod) {
        final List<DayOfWeek> closedDayOfWeeks = List.of(); // 검증 필드 제거에 따른 구현

        final DayOfWeek startDay = timePeriod.startTime().getDayOfWeek();

        return !closedDayOfWeeks.contains(startDay);
    }
}
