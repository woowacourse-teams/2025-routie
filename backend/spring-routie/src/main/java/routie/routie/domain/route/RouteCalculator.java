package routie.routie.domain.route;

import java.util.List;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.RoutiePlace;

public interface RouteCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    Routes calculateRoutes(List<RoutiePlace> routiePlaces, MovingStrategy movingStrategy);
}
