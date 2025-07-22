package routie.routiespace.controller.dto.response;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedWeekday;

public record PlaceListResponse(
        List<PlaceCardResponse> places
) {

    public static PlaceListResponse from(final List<Place> places) {
        List<PlaceCardResponse> PlaceCardsResponse = places.stream()
                .map(PlaceCardResponse::from)
                .toList();

        return new PlaceListResponse(PlaceCardsResponse);
    }

    public record PlaceCardResponse(
            Long id,
            String name,
            String address,
            LocalTime openAt,
            LocalTime closeAt,
            List<DayOfWeek> closedDays
    ) {
        public static PlaceCardResponse from(final Place place) {
            return new PlaceCardResponse(
                    place.getId(),
                    place.getName(),
                    place.getAddress(),
                    place.getOpenAt(),
                    place.getCloseAt(),
                    place.getClosedWeekdays().stream()
                            .map(PlaceClosedWeekday::getClosedDay)
                            .toList()
            );
        }
    }
}
