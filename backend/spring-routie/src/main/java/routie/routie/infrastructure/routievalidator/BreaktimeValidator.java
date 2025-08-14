package routie.routie.infrastructure.routievalidator;

import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.place.domain.Place;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class BreaktimeValidator implements RoutieValidator {

    private static final LocalTime END_OF_DAY = LocalTime.of(23, 59, 59, 999_999_999);
    private static final LocalTime START_OF_DAY = LocalTime.MIN;

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_DURING_BREAKTIME;
    }

    @Override
    public ValidationResult validate(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        List<TimePeriod> timePeriods = validationContext.timePeriods().orderedList();

        return ValidationResult.withoutRoutiePlaces(
                timePeriods.stream()
                        .allMatch(this::isNotDuringBreaktime),
                validationStrategy
        );
    }

    private boolean isNotDuringBreaktime(final TimePeriod timePeriod) {
        final Place place = timePeriod.routiePlace().getPlace();
        final LocalTime breakStartAt = place.getBreakStartAt();
        final LocalTime breakEndAt = place.getBreakEndAt();

        if (breakStartAt == null || breakEndAt == null || breakStartAt.equals(breakEndAt)) {
            return true;
        }

        final LocalTime visitStartTime = timePeriod.startTime().toLocalTime();
        final LocalTime visitEndTime = timePeriod.endTime().toLocalTime();

        return !doPeriodsOverlap(visitStartTime, visitEndTime, breakStartAt, breakEndAt);
    }

    private boolean doPeriodsOverlap(
            final LocalTime visitStart,
            final LocalTime visitEnd,
            final LocalTime breakStart,
            final LocalTime breakEnd
    ) {
        if (visitStart.isAfter(visitEnd)) {
            return doPeriodsOverlap(visitStart, END_OF_DAY, breakStart, breakEnd) ||
                    doPeriodsOverlap(START_OF_DAY, visitEnd, breakStart, breakEnd);
        }

        if (breakStart.isAfter(breakEnd)) {
            return doPeriodsOverlap(visitStart, visitEnd, breakStart, END_OF_DAY) ||
                    doPeriodsOverlap(visitStart, visitEnd, START_OF_DAY, breakEnd);
        }

        return visitStart.isBefore(breakEnd) && visitEnd.isAfter(breakStart);
    }
}
