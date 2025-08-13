package routie.place.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record PlaceCreateRequest(
        @NotBlank String searchedPlaceId,
        @NotBlank String name,
        String roadAddressName,
        @NotBlank String addressName,
        @NotNull Double longitude,
        @NotNull Double latitude,
        @NotNull Integer stayDurationMinutes,
        @NotNull @JsonFormat(pattern = "HH:mm") LocalTime openAt,
        @NotNull @JsonFormat(pattern = "HH:mm") LocalTime closeAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakStartAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakEndAt,
        @NotNull List<DayOfWeek> closedDayOfWeeks
) {
}
