package routie.routie.infrastructure.routecalculator.driving;

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
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiClient;
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiRequest;
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse;
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.SectionResponse;

@Component
@RequiredArgsConstructor
public class DrivingRouteCalculator implements RouteCalculator {

    private final KakaoDrivingRouteApiClient kakaoDrivingRouteApiClient;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public Routes calculateRoutes(final List<RoutiePlace> routiePlaces, final MovingStrategy movingStrategy) {
        KakaoDrivingRouteApiResponse kakaoDrivingRouteApiResponse = kakaoDrivingRouteApiClient.getRoute(
                KakaoDrivingRouteApiRequest.from(routiePlaces)
        );
        List<SectionResponse> sectionResponses = getRouteResponse(kakaoDrivingRouteApiResponse).sectionResponses();

        return mapToRoutes(routiePlaces, movingStrategy, sectionResponses);
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
            final MovingStrategy movingStrategy,
            final List<SectionResponse> sectionResponses
    ) {
        Map<RoutiePlace, Route> routeMap = new HashMap<>();
        for (int i = 0; i < sectionResponses.size(); i++) {
            SectionResponse sectionResponse = sectionResponses.get(i);
            RoutiePlace from = routiePlaces.get(i);
            RoutiePlace to = routiePlaces.get(i + 1);
            Route route = new Route(from, to, movingStrategy, sectionResponse.duration() / 60,
                    sectionResponse.distance());
            routeMap.put(from, route);
        }
        return new Routes(routeMap);
    }
}
