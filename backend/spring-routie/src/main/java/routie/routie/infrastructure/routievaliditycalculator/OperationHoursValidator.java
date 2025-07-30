package routie.routie.infrastructure.routievaliditycalculator;

import java.time.LocalTime;
import org.springframework.stereotype.Component;
import routie.place.domain.Place;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class OperationHoursValidator implements RoutieValidator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_WITHIN_OPERATION_HOURS;
    }

    @Override
    public boolean isValid(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return validationContext.timePeriodByRoutiePlace().entrySet().stream()
                .allMatch(entry -> isWithinBusinessHours(
                        entry.getKey().getPlace(),
                        entry.getValue()
                ));
    }

    private boolean isWithinBusinessHours(final Place place, final TimePeriod timePeriod) {

        final LocalTime openAt = place.getOpenAt();
        final LocalTime closeAt = place.getCloseAt();

        if (openAt == null || closeAt == null) {
            return true;
        }

        final LocalTime visitStartTime = timePeriod.startTime().toLocalTime();
        final LocalTime visitEndTime = timePeriod.endTime().toLocalTime();

        return isWithinOperatingHours(visitStartTime, openAt, closeAt) &&
                isWithinOperatingHours(visitEndTime, openAt, closeAt);
    }

    private boolean isWithinOperatingHours(
            final LocalTime time,
            final LocalTime openAt,
            final LocalTime closeAt
    ) {
        return !time.isBefore(openAt) && !time.isAfter(closeAt);
    }
}
