package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import routie.routie.domain.RoutiePlace;

public record TimePeriod(
        RoutiePlace routiePlace,
        LocalDateTime startTime,
        LocalDateTime endTime
) {

    public TimePeriod {
        validateRoutiePlace(routiePlace);
        validateStartTime(startTime);
        validateEndTime(endTime);
    }

    public void validateRoutiePlace(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new IllegalArgumentException("RoutiePlace는 null일 수 없습니다.");
        }
    }

    public void validateStartTime(final LocalDateTime startTime) {
        if (startTime == null) {
            throw new IllegalArgumentException("시작 시간은 null일 수 없습니다.");
        }
    }

    public void validateEndTime(final LocalDateTime endTime) {
        if (endTime == null) {
            throw new IllegalArgumentException("종료 시간은 null일 수 없습니다.");
        }
    }
}
