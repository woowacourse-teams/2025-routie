package routie.routie.infrastructure.routecalculator;

import java.util.List;
import lombok.RequiredArgsConstructor;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.route.Routes;

@RequiredArgsConstructor
public class RouteCalculatorComposite implements RouteCalculator {

    private final List<RouteCalculator> routeCalculators;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy != null;
    }

    @Override
    public Routes calculateRoutes(final List<RoutiePlace> routiePlaces, final MovingStrategy movingStrategy) {
        return selectRouteCalculator(movingStrategy).calculateRoutes(routiePlaces, movingStrategy);
    }

    private RouteCalculator selectRouteCalculator(final MovingStrategy movingStrategy) {
        return routeCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(movingStrategy))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVING_STRATEGY_NOT_SUPPORTED));
    }
}
