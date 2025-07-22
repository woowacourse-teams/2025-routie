package routie.routiespace.controller.dto.request;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record PlaceCreateRequest(
        String name,
        String address,
        int stayDurationMinutes,
        LocalTime openAt,
        LocalTime closeAt,
        LocalTime breakStartAt,
        LocalTime breakEndAt,
        List<DayOfWeek> closedDays
) {
}
