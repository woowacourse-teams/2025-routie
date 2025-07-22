package routie.place.controller.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record PlaceUpdateRequest(
        @Min(value = 0, message = "체류 시간은 0분 이상이어야 합니다.") @Max(value = 1440, message = "체류 시간은 1440분(24시간) 이하여야 합니다.") int stayDurationMinutes,
        LocalTime openAt,
        LocalTime closeAt,
        LocalTime breakStartAt,
        LocalTime breakEndAt,
        List<DayOfWeek> closedDays
) {

    public PlaceUpdateRequest {
        validateBreakTime(breakStartAt, breakEndAt);
    }

    private void validateBreakTime(final LocalTime breakStartAt, final LocalTime breakEndAt) {
        boolean hasBreakStart = breakStartAt != null;
        boolean hasBreakEnd = breakEndAt != null;

        if (hasBreakStart != hasBreakEnd) {
            throw new IllegalArgumentException("브레이크 타임 시작 시간과 종료 시간은 함께 존재해야 합니다.");
        }
    }
}
