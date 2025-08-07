package routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.routie.domain.RoutiePlace;

import java.util.ArrayList;
import java.util.List;

public record KakaoDrivingRouteApiRequest(
        @JsonProperty("origin") CoordinateRequest origin,
        @JsonProperty("destination") CoordinateRequest destination,
        @JsonProperty("waypoints") List<CoordinateRequest> waypoints
) {

    // TODO: 실제 API 호출 시에는 이 부분을 제거하고, 좌표를 사용해야 함.
    private static final List<CoordinateRequest> MOCK_COORDINATE_RESPONSES = List.of(
            new CoordinateRequest(127.0508759, 37.5059523),
            new CoordinateRequest(127.0506698, 37.5057434),
            new CoordinateRequest(127.1494305, 37.4385195)
    );

    public static KakaoDrivingRouteApiRequest from(final List<RoutiePlace> routiePlaces) {
        int size = routiePlaces.size();
        List<CoordinateRequest> coordinateRequests = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            coordinateRequests.add(MOCK_COORDINATE_RESPONSES.get(i % MOCK_COORDINATE_RESPONSES.size()));
        }
        return new KakaoDrivingRouteApiRequest(
                coordinateRequests.getFirst(),
                coordinateRequests.getLast(),
                coordinateRequests.subList(1, size - 1)
        );
    }

    private record CoordinateRequest(
            @JsonProperty("x") double longitude,
            @JsonProperty("y") double latitude
    ) {
    }
}
