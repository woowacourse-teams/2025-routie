package routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.stream.IntStream;
import routie.business.place.domain.Place;
import routie.business.routie.domain.RoutiePlace;

public record KakaoDrivingRouteApiRequest(
        @JsonProperty("origin") CoordinateRequest origin,
        @JsonProperty("destination") CoordinateRequest destination,
        @JsonProperty("waypoints") List<CoordinateRequest> waypoints
) {


    public static KakaoDrivingRouteApiRequest from(final List<RoutiePlace> routiePlaces) {
        return new KakaoDrivingRouteApiRequest(
                CoordinateRequest.from(routiePlaces.getFirst()),
                CoordinateRequest.from(routiePlaces.getLast()),
                IntStream.range(1, routiePlaces.size() - 1)
                        .mapToObj(routiePlaces::get)
                        .map(CoordinateRequest::from)
                        .toList()
        );
    }

    public record CoordinateRequest(
            @JsonProperty("x") double longitude,
            @JsonProperty("y") double latitude
    ) {

        public static CoordinateRequest from(final RoutiePlace routiePlace) {
            final Place place = routiePlace.getPlace();
            return new CoordinateRequest(
                    place.getLongitude(),
                    place.getLatitude()
            );
        }
    }
}
