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
        @NotNull Double latitude
) {
}
