package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;

public record TimePeriod(
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}
