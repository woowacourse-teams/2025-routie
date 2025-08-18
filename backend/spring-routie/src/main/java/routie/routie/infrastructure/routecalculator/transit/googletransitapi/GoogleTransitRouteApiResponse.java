package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record GoogleTransitRouteApiResponse(
        @JsonProperty("routes") List<RouteResponse> routeResponses
) {

    public record RouteResponse(
            @JsonProperty("duration") String duration,
            @JsonProperty("distanceMeters") int distance
    ) {
    }
}
