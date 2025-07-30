package routie.routie.domain;

import java.time.LocalDateTime;
import java.util.Map;
import routie.routie.domain.timeperiod.TimePeriod;

public record ValidationContext(
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
) {
}
