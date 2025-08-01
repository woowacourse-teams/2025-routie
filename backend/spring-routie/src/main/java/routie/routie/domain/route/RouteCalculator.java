package routie.routie.domain.route;

import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.DurationCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;

@Component
@RequiredArgsConstructor
public class RouteCalculator {

    private final DistanceCalculator distanceCalculator;
    private final DurationCalculator durationCalculator;

    public Routes calculateRoutes(final List<RoutiePlace> routiePlaces) {
        routiePlaces.sort(Comparator.comparing(RoutiePlace::getSequence));
        Routes routes = Routes.empty();

        for (int sequence = 0; sequence < routiePlaces.size() - 1; sequence++) {
            RoutiePlace from = routiePlaces.get(sequence);
            RoutiePlace to = routiePlaces.get(sequence + 1);

            Place fromPlace = from.getPlace();
            Place toPlace = to.getPlace();
            MovingStrategy movingStrategy = MovingStrategy.DRIVING;

            int distance = distanceCalculator.calculateDistance(fromPlace, toPlace, movingStrategy);
            int duration = durationCalculator.calculateDuration(fromPlace, toPlace, movingStrategy);

            Route route = new Route(
                    from,
                    to,
                    movingStrategy,
                    duration,
                    distance
            );

            routes = routes.withAdded(from, route);
        }
        return routes;
    }
}
