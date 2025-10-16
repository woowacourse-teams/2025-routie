package routie.business.routie.infrastructure.routecalculator;

import java.util.List;
import lombok.RequiredArgsConstructor;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.domain.route.RouteCalculationContext;
import routie.business.routie.domain.route.RouteCalculator;
import routie.business.routie.domain.route.Routes;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@RequiredArgsConstructor
public class RouteCalculatorComposite implements RouteCalculator {

    private final List<RouteCalculator> routeCalculators;

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy != null;
    }

    @Override
    public Routes calculateRoutes(final RouteCalculationContext routeCalculationContext) {
        return selectRouteCalculator(routeCalculationContext).calculateRoutes(routeCalculationContext);
    }

    private RouteCalculator selectRouteCalculator(final RouteCalculationContext routeCalculationContext) {
        final MovingStrategy movingStrategy = routeCalculationContext.getMovingStrategy();
        return routeCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(movingStrategy))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVING_STRATEGY_NOT_SUPPORTED));
    }
}
