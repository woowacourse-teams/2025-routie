package routie.place.controller.dto.response;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedWeekday;

public record PlaceReadResponse(
        String name,
        String address,
        int stayDurationMinutes,
        LocalTime openAt,
        LocalTime closeAt,
        LocalTime breakStartAt,
        LocalTime breakEndAt,
        List<DayOfWeek> closedDays
) {

    public static PlaceReadResponse from(final Place place) {
        return new PlaceReadResponse(
                place.getName(),
                place.getAddress(),
                place.getStayDurationMinutes(),
                place.getOpenAt(),
                place.getCloseAt(),
                place.getBreakStartAt(),
                place.getBreakEndAt(),
                place.getClosedWeekdays().stream().map(PlaceClosedWeekday::getClosedDay).toList()
        );
    }
}
