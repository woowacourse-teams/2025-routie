package routie.routie.controller.dto.response;

import java.util.List;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;

public record RoutieReadResponse(
        Long id,
        List<RoutiePlaceResponse> places,
        List<RouteResponse> routes
) {
    public static RoutieReadResponse from(final Routie routie, final List<Route> routes) {
        return new RoutieReadResponse(
                routie.getId(),
                routie.getRoutiePlaces().stream()
                        .map(RoutiePlaceResponse::from)
                        .toList(),
                routes.stream()
                        .map(RouteResponse::from)
                        .toList()
        );
    }

    private record RoutiePlaceResponse(
            Long id,
            int sequence,
            Long placeId
    ) {
        private static RoutiePlaceResponse from(final RoutiePlace routiePlace) {
            return new RoutiePlaceResponse(
                    routiePlace.getId(),
                    routiePlace.getSequence(),
                    routiePlace.getPlace().getId()
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
