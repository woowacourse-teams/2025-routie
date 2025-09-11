package routie.business.routie.infrastructure.routecalculator.transit;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.global.exception.BusinessException;
import routie.global.exception.ErrorCode;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.domain.route.Route;
import routie.business.routie.domain.route.RouteCalculationContext;
import routie.business.routie.domain.route.RouteCalculator;
import routie.business.routie.domain.route.Routes;
import routie.business.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiClient;
import routie.business.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiRequest;
import routie.business.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse;
import routie.business.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse.RouteResponse;

@Component
@RequiredArgsConstructor
public class TransitRouteCalculator implements RouteCalculator {

    private static final int PAST_DAYS_LIMIT = 7;
    private static final int FUTURE_DAYS_LIMIT = 100;

    private final GoogleTransitRouteApiClient googleTransitRouteApiClient;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.TRANSIT);
    }

    @Override
    public Routes calculateRoutes(final RouteCalculationContext routeCalculationContext) {
        List<RoutiePlace> routiePlaces = routeCalculationContext.getOrderedRoutiePlaces();
        LocalDateTime startDateTime = routeCalculationContext.getStartDateTime()
                .orElse(LocalDateTime.now());

        validateStartDateTime(startDateTime);

        Map<RoutiePlace, Route> routeMap = new HashMap<>();
        for (int sequence = 0; sequence < routiePlaces.size() - 1; sequence++) {
            RoutiePlace from = routiePlaces.get(sequence);
            RoutiePlace to = routiePlaces.get(sequence + 1);

            if (isZeroDistanceRoute(from, to)) {
                routeMap.put(from, new Route(from, to, 0, 0));
                continue;
            }

            GoogleTransitRouteApiResponse googleTransitRouteApiResponse =
                    googleTransitRouteApiClient.getRoute(GoogleTransitRouteApiRequest.from(startDateTime, from, to));

            RouteResponse routeResponse = googleTransitRouteApiResponse.routeResponses()
                    .getFirst();

            routeMap.put(
                    from,
                    new Route(
                            from,
                            to,
                            parseDurationResponseToInt(routeResponse.duration()) / 60,
                            routeResponse.distance()
                    )
            );
        }
        return new Routes(routeMap);
    }

    private boolean isZeroDistanceRoute(final RoutiePlace from, final RoutiePlace to) {
        return from.getPlace().hasSameCoordinate(to.getPlace());
    }

    /**
     * 경로 계산 시작 시간이 유효한 범위(과거 7일 ~ 미래 100일)에 있는지 검증합니다.
     *
     * @param startDateTime 검증할 시작 시간
     */
    private void validateStartDateTime(final LocalDateTime startDateTime) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime earliestAllowed = now.minusDays(PAST_DAYS_LIMIT);
        LocalDateTime latestAllowed = now.plusDays(FUTURE_DAYS_LIMIT);

        if (startDateTime.isBefore(earliestAllowed) || startDateTime.isAfter(latestAllowed)) {
            throw new BusinessException(ErrorCode.GOOGLE_TRANSIT_ROUTE_API_DEPARTURE_TIME_OUT_OF_RANGE);
        }
    }

    private int parseDurationResponseToInt(final String durationResponse) {
        if (durationResponse != null && durationResponse.endsWith("s")) {
            String secondsOnly = durationResponse.substring(0, durationResponse.length() - 1);
            return Integer.parseInt(secondsOnly);
        }
        throw new BusinessException(ErrorCode.GOOGLE_TRANSIT_ROUTE_API_ERROR);
    }
}
