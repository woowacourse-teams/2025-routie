package routie.place.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedDayOfWeek;

public record PlaceReadResponse(
        String name,
        String roadAddressName,
        String addressName,
        Double longitude,
        Double latitude,
        int stayDurationMinutes,
        @JsonFormat(pattern = "HH:mm") LocalTime openAt,
        @JsonFormat(pattern = "HH:mm") LocalTime closeAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakStartAt,
        @JsonFormat(pattern = "HH:mm") LocalTime breakEndAt,
        List<DayOfWeek> closedDayOfWeeks
) {

    public static PlaceReadResponse from(final Place place) {
        return new PlaceReadResponse(
                place.getName(),
                place.getRoadAddressName(),
                place.getAddressName(),
                place.getLongitude(),
                place.getLatitude(),
                place.getStayDurationMinutes(),
                place.getOpenAt(),
                place.getCloseAt(),
                place.getBreakStartAt(),
                place.getBreakEndAt(),
                place.getPlaceClosedDayOfWeeks().stream()
                        .map(PlaceClosedDayOfWeek::getClosedDayOfWeek)
                        .toList()
        );
    }
}
