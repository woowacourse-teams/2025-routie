package routie.place.controller.dto.request;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record PlaceUpdateRequest(
        int stayDurationMinutes,
        LocalTime openAt,
        LocalTime closeAt,
        LocalTime breakStartAt,
        LocalTime breakEndAt,
        List<DayOfWeek> closedDays
) {
}
