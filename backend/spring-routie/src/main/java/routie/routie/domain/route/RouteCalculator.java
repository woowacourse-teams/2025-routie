package routie.routie.domain.route;

public interface RouteCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    Routes calculateRoutes(RouteCalculationContext routeCalculationContext);
}
