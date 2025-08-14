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
public class OperationHoursValidator implements RoutieValidator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_WITHIN_OPERATION_HOURS;
    }

    @Override
    public ValidationResult validate(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        List<TimePeriod> timePeriods = validationContext.timePeriods().orderedList();

        return ValidationResult.withoutRoutiePlaces(
                timePeriods.stream()
                        .allMatch(this::isWithinBusinessHours),
                validationStrategy
        );
    }

    private boolean isWithinBusinessHours(final TimePeriod timePeriod) {
        Place place = timePeriod.routiePlace().getPlace();

        final LocalTime openAt = place.getOpenAt();
        final LocalTime closeAt = place.getCloseAt();

        if (openAt == null || closeAt == null) {
            return true;
        }

        final LocalTime visitStartTime = timePeriod.startTime().toLocalTime();
        final LocalTime visitEndTime = timePeriod.endTime().toLocalTime();

        return isTimeWithinOperatingHours(visitStartTime, openAt, closeAt) &&
                isTimeWithinOperatingHours(visitEndTime, openAt, closeAt);
    }

    private boolean isTimeWithinOperatingHours(
            final LocalTime time,
            final LocalTime openAt,
            final LocalTime closeAt
    ) {
        if (openAt.isAfter(closeAt)) {
            return !time.isBefore(openAt) || !time.isAfter(closeAt);
        }

        return !time.isBefore(openAt) && !time.isAfter(closeAt);
    }
}
