package routie.routie.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.timeperiod.TimePeriod;

public record RoutieReadResponse(
        List<RoutiePlaceResponse> routiePlaces,
        List<RouteResponse> routes
) {
    public static RoutieReadResponse from(
            final Routie routie,
            final List<Route> routes,
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
    ) {
        return new RoutieReadResponse(
                routie.getRoutiePlaces().stream()
                        .map(routiePlace -> RoutiePlaceResponse.from(
                                routiePlace,
                                timePeriodByRoutiePlace != null ? timePeriodByRoutiePlace.get(routiePlace) : null
                        ))
                        .toList(),
                routes.stream()
                        .map(RouteResponse::from)
                        .toList()
        );
    }

    private record RoutiePlaceResponse(
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
                    timePeriod != null ? timePeriod.startTime() : null,
                    timePeriod != null ? timePeriod.endTime() : null
            );
        }
    }

    private record RouteResponse(
            int fromSequence,
            int toSequence,
            MovingStrategy movingStrategy,
            int duration,
            int distance
    ) {

        private static RouteResponse from(final Route route) {
            return new RouteResponse(
                    route.fromSequence(),
                    route.toSequence(),
                    route.movingStrategy(),
                    route.duration(),
                    route.distance()
            );
        }
    }
}
