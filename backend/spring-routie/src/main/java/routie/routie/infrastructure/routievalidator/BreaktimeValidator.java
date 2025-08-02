package routie.routie.infrastructure.routievalidator;

import java.time.LocalTime;
import org.springframework.stereotype.Component;
import routie.place.domain.Place;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

@Component
public class BreaktimeValidator implements RoutieValidator {
    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy == ValidationStrategy.IS_NOT_DURING_BREAKTIME;
    }

    @Override
    public boolean isValid(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return validationContext.timePeriods().orderedList().stream()
                .allMatch(this::isWithoutBreaktime);
    }

    private boolean isWithoutBreaktime(final TimePeriod timePeriod) {
        final Place place = timePeriod.routiePlace().getPlace();
        final LocalTime breakStartAt = place.getBreakStartAt();
        final LocalTime breakEndAt = place.getBreakEndAt();

        if (breakStartAt == null || breakEndAt == null) {
            return true;
        }

        final LocalTime visitStartTime = timePeriod.startTime().toLocalTime();
        final LocalTime visitEndTime = timePeriod.endTime().toLocalTime();

        boolean endsBeforeBreak = !visitEndTime.isAfter(breakStartAt);
        boolean startsAfterBreak = !visitStartTime.isBefore(breakEndAt);

        return endsBeforeBreak || startsAfterBreak;
    }
}
