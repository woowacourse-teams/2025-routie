package routie.routie.domain.routievalidator;

import java.time.LocalDateTime;
import java.util.Map;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.timeperiod.TimePeriod;

public record ValidationContext(
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
) {
}
