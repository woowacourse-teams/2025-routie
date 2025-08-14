package routie.routie.infrastructure.routecalculator.transit;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.route.Routes;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiClient;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiRequest;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse.RouteResponse;

@Component
@RequiredArgsConstructor
public class TransitRouteCalculator implements RouteCalculator {

    private final GoogleTransitRouteApiClient googleTransitRouteApiClient;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.TRANSIT);
    }

    @Override
    public Routes calculateRoutes(final List<RoutiePlace> routiePlaces, final MovingStrategy movingStrategy) {
        Map<RoutiePlace, Route> routeMap = new HashMap<>();
        for (int sequence = 0; sequence < routiePlaces.size() - 1; sequence++) {
            RoutiePlace from = routiePlaces.get(sequence);
            RoutiePlace to = routiePlaces.get(sequence + 1);
            GoogleTransitRouteApiResponse googleTransitRouteApiResponse =
                    googleTransitRouteApiClient.getRoute(GoogleTransitRouteApiRequest.from(from, to));

            RouteResponse routeResponse = googleTransitRouteApiResponse.routeResponses()
                    .getFirst();

            routeMap.put(
                    from,
                    new Route(
                            from,
                            to,
                            parseDurationResponseToInt(routeResponse.duration()),
                            routeResponse.distance()
                    )
            );
        }
        return new Routes(routeMap);
    }

    private int parseDurationResponseToInt(final String durationResponse) {
        if (durationResponse != null && durationResponse.endsWith("s")) {
            String secondsOnly = durationResponse.substring(0, durationResponse.length() - 1);
            return Integer.parseInt(secondsOnly);
        }
        throw new BusinessException(ErrorCode.GOOGLE_TRANSIT_ROUTE_API_ERROR);
    }
}
