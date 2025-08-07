package routie.routie.domain.routievalidator;

import java.time.LocalDateTime;
import routie.routie.domain.timeperiod.TimePeriods;

public record ValidationContext(
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        TimePeriods timePeriods
) {
}
