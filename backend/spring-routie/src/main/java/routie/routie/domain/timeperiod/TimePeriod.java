package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import routie.routie.domain.RoutiePlace;

public record TimePeriod(
        RoutiePlace routiePlace,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}
