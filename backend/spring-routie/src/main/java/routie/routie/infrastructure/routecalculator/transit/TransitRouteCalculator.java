package routie.routie.infrastructure.routecalculator.transit;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.MovingStrategy;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.RouteCalculationContext;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.route.Routes;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiClient;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiRequest;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse;
import routie.routie.infrastructure.routecalculator.transit.googletransitapi.GoogleTransitRouteApiResponse.RouteResponse;

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
        List<RoutiePlace> routiePlaces = routeCalculationContext.getRoutiePlaces();
        LocalDateTime startDateTime = routeCalculationContext.getStartDateTime()
                .orElseThrow(() -> new IllegalArgumentException("대중교통 Route 계산에서 startDateTime은 null이 될 수 없습니다."));

        validateStartDateTime(startDateTime);

        Map<RoutiePlace, Route> routeMap = new HashMap<>();
        for (int sequence = 0; sequence < routiePlaces.size() - 1; sequence++) {
            RoutiePlace from = routiePlaces.get(sequence);
            RoutiePlace to = routiePlaces.get(sequence + 1);
            GoogleTransitRouteApiResponse googleTransitRouteApiResponse =
                    googleTransitRouteApiClient.getRoute(GoogleTransitRouteApiRequest.from(startDateTime, from, to));

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
            throw new IllegalArgumentException("대중교통 Route 계산 시작 시간은 현재로부터 과거 7일부터 미래 100일 사이여야 합니다.");
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
