package routie.routie.domain.route;

import routie.place.domain.MovingStrategy;

public interface RouteCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    Routes calculateRoutes(RouteCalculationContext routeCalculationContext);
}
