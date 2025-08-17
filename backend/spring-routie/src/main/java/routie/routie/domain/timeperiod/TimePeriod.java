package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
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
            throw new BusinessException(ErrorCode.ROUTIE_PLACE_NULL);
        }
    }

    public void validateStartTime(final LocalDateTime startTime) {
        if (startTime == null) {
            throw new BusinessException(ErrorCode.TIME_PERIOD_START_TIME_NULL);
        }
    }

    public void validateEndTime(final LocalDateTime endTime) {
        if (endTime == null) {
            throw new BusinessException(ErrorCode.TIME_PERIOD_END_TIME_NULL);
        }
    }
}
