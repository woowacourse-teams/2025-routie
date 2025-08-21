package routie.routie.domain.routievalidator;

import java.time.LocalDateTime;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
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
        validateTimeOrder(startDateTime, endDateTime);
    }

    private void validateStartDateTime(final LocalDateTime startDateTime) {
        if (startDateTime == null) {
            throw new BusinessException(ErrorCode.ROUTIE_START_TIME_NULL);
        }
    }

    private void validateEndDateTime(final LocalDateTime endDateTime) {
        if (endDateTime == null) {
            throw new BusinessException(ErrorCode.ROUTIE_END_TIME_NULL);
        }
    }

    private void validateTimePeriods(final TimePeriods timePeriods) {
        if (timePeriods == null) {
            throw new BusinessException(ErrorCode.ROUTIE_TIME_PERIODS_NULL);
        }
    }

    private void validateTimeOrder(final LocalDateTime startDateTime, final LocalDateTime endDateTime) {
        if (endDateTime.isBefore(startDateTime)) {
            throw new BusinessException(ErrorCode.ROUTIE_END_TIME_BEFORE_START_TIME);
        }
    }
}
