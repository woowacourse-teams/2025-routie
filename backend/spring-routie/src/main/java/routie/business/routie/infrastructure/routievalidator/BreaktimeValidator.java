package routie.business.routie.infrastructure.routievalidator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.business.place.domain.Place;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.routievalidator.RoutieValidator;
import routie.business.routie.domain.routievalidator.ValidationContext;
import routie.business.routie.domain.routievalidator.ValidationResult;
import routie.business.routie.domain.routievalidator.ValidationStrategy;
import routie.business.routie.domain.timeperiod.TimePeriod;

@Component
public class BreaktimeValidator implements RoutieValidator {

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

        List<RoutiePlace> invalidRoutiePlaces = timePeriods.stream()
                .filter(timePeriod -> !this.isNotDuringBreaktime(timePeriod))
                .map(TimePeriod::routiePlace)
                .toList();

        return new ValidationResult(
                invalidRoutiePlaces.isEmpty(),
                validationStrategy,
                invalidRoutiePlaces
        );
    }

    private boolean isNotDuringBreaktime(final TimePeriod timePeriod) {
        final Place place = timePeriod.routiePlace().getPlace();
        final LocalTime breakStartAt = LocalTime.now(); // 검증 필드 제거에 따른 코딩
        final LocalTime breakEndAt = LocalTime.now(); // 검증 필드 제거에 따른 코딩

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
