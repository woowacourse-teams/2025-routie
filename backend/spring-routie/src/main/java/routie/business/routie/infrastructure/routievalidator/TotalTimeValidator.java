package routie.business.routie.infrastructure.routievalidator;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.business.routie.domain.routievalidator.RoutieValidator;
import routie.business.routie.domain.routievalidator.ValidationContext;
import routie.business.routie.domain.routievalidator.ValidationResult;
import routie.business.routie.domain.routievalidator.ValidationStrategy;
import routie.business.routie.domain.timeperiod.TimePeriod;
import routie.business.routie.domain.timeperiod.TimePeriods;

@Component
public class TotalTimeValidator implements RoutieValidator {

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_WITHIN_TOTAL_TIME;
    }

    @Override
    public ValidationResult validate(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        final TimePeriods timePeriods = validationContext.timePeriods();

        return ValidationResult.withoutRoutiePlaces(
                isWithinTotalTime(validationContext.startDateTime(), validationContext.endDateTime(), timePeriods),
                validationStrategy);
    }

    private boolean isWithinTotalTime(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final TimePeriods timePeriods
    ) {
        final List<TimePeriod> orderedTimePeriods = timePeriods.orderedList();

        if (orderedTimePeriods.isEmpty()) {
            return true;
        }

        final LocalDateTime firstPeriodStartTime = orderedTimePeriods.getFirst().startTime();
        final LocalDateTime lastPeriodEndTime = orderedTimePeriods.getLast().endTime();

        return !firstPeriodStartTime.isBefore(startDateTime) && !lastPeriodEndTime.isAfter(endDateTime);
    }
}
