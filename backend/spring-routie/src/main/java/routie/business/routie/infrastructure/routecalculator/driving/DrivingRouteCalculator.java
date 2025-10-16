package routie.business.routie.infrastructure.routecalculator.driving;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.domain.route.Route;
import routie.business.routie.domain.route.RouteCalculationContext;
import routie.business.routie.domain.route.RouteCalculator;
import routie.business.routie.domain.route.Routes;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiClient;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiRequest;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.SectionResponse;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Component
@RequiredArgsConstructor
public class DrivingRouteCalculator implements RouteCalculator {

    private final KakaoDrivingRouteApiClient kakaoDrivingRouteApiClient;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public Routes calculateRoutes(final RouteCalculationContext routeCalculationContext) {
        final List<RoutiePlace> routiePlaces = routeCalculationContext.getOrderedRoutiePlaces();

        final RoutiePlace from = routiePlaces.getFirst();
        final RoutiePlace to = routiePlaces.getLast();
        if (isZeroDistanceRoute(routiePlaces, from, to)) {
            return new Routes(Map.of(from, new Route(from, to, 0, 0)));
        }

        final KakaoDrivingRouteApiResponse kakaoDrivingRouteApiResponse = kakaoDrivingRouteApiClient.getRoute(
                KakaoDrivingRouteApiRequest.from(routiePlaces)
        );
        final List<SectionResponse> sectionResponses = getRouteResponse(
                kakaoDrivingRouteApiResponse).sectionResponses();

        return mapToRoutes(routiePlaces, sectionResponses);
    }

    private boolean isZeroDistanceRoute(
            final List<RoutiePlace> routiePlaces,
            final RoutiePlace from,
            final RoutiePlace to
    ) {
        return routiePlaces.size() == 2 && from.getPlace().hasSameCoordinate(to.getPlace());
    }

    private KakaoDrivingRouteApiResponse.RouteResponse getRouteResponse(
            final KakaoDrivingRouteApiResponse kakaoDrivingRouteApiResponse
    ) {
        return kakaoDrivingRouteApiResponse.routeResponses().stream()
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.KAKAO_DRIVING_ROUTE_API_RESPONSE_EMPTY));
    }

    private Routes mapToRoutes(
            final List<RoutiePlace> routiePlaces,
            final List<SectionResponse> sectionResponses
    ) {
        final Map<RoutiePlace, Route> routeMap = new HashMap<>();
        for (int i = 0; i < sectionResponses.size(); i++) {
            final SectionResponse sectionResponse = sectionResponses.get(i);
            final RoutiePlace from = routiePlaces.get(i);
            final RoutiePlace to = routiePlaces.get(i + 1);
            final Route route = new Route(
                    from, to, sectionResponse.duration() / 60,
                    sectionResponse.distance()
            );
            routeMap.put(from, route);
        }
        return new Routes(routeMap);
    }
}
