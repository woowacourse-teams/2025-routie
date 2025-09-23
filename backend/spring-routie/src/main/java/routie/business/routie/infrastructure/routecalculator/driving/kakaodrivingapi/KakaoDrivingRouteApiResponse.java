package routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record KakaoDrivingRouteApiResponse(
        @JsonProperty("routes") List<RouteResponse> routeResponses
) {

    public record RouteResponse(
            @JsonProperty("sections") List<SectionResponse> sectionResponses
    ) {
    }

    public record SectionResponse(
            @JsonProperty("duration") int duration,
            @JsonProperty("distance") int distance
    ) {
    }
}
