package routie.place.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record PlaceUpdateRequest(
        @NotNull Integer stayDurationMinutes,
        @JsonFormat(pattern = "HH:mm") LocalTime openAt,
        @JsonFormat(pattern = "HH:mm") LocalTime closeAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakStartAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakEndAt,
        List<DayOfWeek> closedDayOfWeeks
) {
}
