package routie.routie.domain.routievalidator;

import java.time.LocalDateTime;
import routie.routie.domain.timeperiod.TimePeriods;

public record ValidationContext(
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        TimePeriods timePeriods
) {

    public ValidationContext {
        validateStartDateTime(startDateTime);
        validateEndDateTime(endDateTime);
        validateTimePeriods(timePeriods);
    }

    private void validateStartDateTime(final LocalDateTime startDateTime) {
        if (startDateTime == null) {
            throw new IllegalArgumentException("시작 시간은 null일 수 없습니다.");
        }
    }

    private void validateEndDateTime(final LocalDateTime endDateTime) {
        if (endDateTime == null) {
            throw new IllegalArgumentException("종료 시간은 null일 수 없습니다.");
        }
    }

    private void validateTimePeriods(final TimePeriods timePeriods) {
        if (timePeriods == null) {
            throw new IllegalArgumentException("기간은 null일 수 없습니다.");
        }
    }
}
