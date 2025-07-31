package routie.routie.infrastructure.routievalidator;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

@Component
public class TotalTimeValidator implements RoutieValidator {

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_WITHIN_TOTAL_TIME;
    }

    @Override
    public boolean isValid(final ValidationContext validationContext,
                           final ValidationStrategy validationStrategy) {
        TimePeriods timePeriods = validationContext.timePeriods();

        return calculateTotalTimeValidity(
                validationContext.startDateTime(),
                validationContext.endDateTime(),
                timePeriods
        );
    }

    private boolean calculateTotalTimeValidity(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final TimePeriods timePeriods
    ) {
        List<TimePeriod> orderedTimePeriods = timePeriods.orderedList();

        if (orderedTimePeriods.isEmpty()) {
            return true;
        }

        LocalDateTime firstPeriodStartTime = orderedTimePeriods.getFirst().startTime();
        LocalDateTime lastPeriodEndTime = orderedTimePeriods.getLast().endTime();

        return !firstPeriodStartTime.isBefore(startDateTime) && !lastPeriodEndTime.isAfter(endDateTime);
    }
}
