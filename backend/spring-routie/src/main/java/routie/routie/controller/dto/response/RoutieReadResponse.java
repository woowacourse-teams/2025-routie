package routie.routie.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

public record RoutieReadResponse(
        List<RoutiePlaceResponse> routiePlaces,
        List<RouteResponse> routes
) {
    public static RoutieReadResponse from(
            final Routie routie,
            final List<Route> routes,
            final TimePeriods timePeriods
    ) {
        return new RoutieReadResponse(
                routie.getRoutiePlaces().stream()
                        .map(routiePlace -> RoutiePlaceResponse.from(
                                routiePlace,
                                timePeriods == null ? null : timePeriods.getByRoutiePlace(routiePlace)
                        ))
                        .toList(),
                routes.stream()
                        .map(RouteResponse::from)
                        .toList()
        );
    }

    public record RoutiePlaceResponse(
            Long id,
            int sequence,
            Long placeId,
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arriveDateTime,
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departureDateTime
    ) {
        private static RoutiePlaceResponse from(final RoutiePlace routiePlace, final TimePeriod timePeriod) {
            return new RoutiePlaceResponse(
                    routiePlace.getId(),
                    routiePlace.getSequence(),
                    routiePlace.getPlace().getId(),
                    timePeriod == null ? null : timePeriod.startTime(),
                    timePeriod == null ? null : timePeriod.endTime()
            );
        }
    }

    public record RouteResponse(
            int fromSequence,
            int toSequence,
            int duration,
            int distance
    ) {

        private static RouteResponse from(final Route route) {
            return new RouteResponse(
                    route.from().getSequence(),
                    route.to().getSequence(),
                    route.duration(),
                    route.distance()
            );
        }
    }
}
