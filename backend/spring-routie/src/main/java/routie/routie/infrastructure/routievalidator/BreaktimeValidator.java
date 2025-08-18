package routie.routie.infrastructure.routievalidator;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    private static final LocalTime END_OF_DAY = LocalTime.MAX;
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

        final LocalDateTime visitStartTime = timePeriod.startTime();
        final LocalDateTime visitEndTime = timePeriod.endTime();

        return !doPeriodsOverlap(visitStartTime, visitEndTime, breakStartAt, breakEndAt);
    }

    private boolean doPeriodsOverlap(
            final LocalDateTime visitStart,
            final LocalDateTime visitEnd,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt
    ) {
        LocalDate currentDate = visitStart.toLocalDate().minusDays(1);
        LocalDate endDate = visitEnd.toLocalDate();

        while (!currentDate.isAfter(endDate)) {
            LocalDateTime breakStart = currentDate.atTime(breakStartAt);
            LocalDateTime breakEnd = breakStartAt.isAfter(breakEndAt)
                    ? breakStart.plusDays(1).with(breakEndAt)
                    : breakStart.with(breakEndAt);

            boolean overlaps = visitStart.isBefore(breakEnd) && breakStart.isBefore(visitEnd);
            if (overlaps) {
                return true;
            }
            currentDate = currentDate.plusDays(1);
        }

        return false;
    }
}
