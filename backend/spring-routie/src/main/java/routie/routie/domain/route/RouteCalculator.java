package routie.routie.domain.route;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.place.domain.TravelTimeCalculator;
import routie.routie.domain.RoutiePlace;

@Component
public class RouteCalculator {

    private final DistanceCalculator distanceCalculator;
    private final TravelTimeCalculator travelTimeCalculator;

    public RouteCalculator(
            final DistanceCalculator distanceCalculator,
            final TravelTimeCalculator travelTimeCalculator
    ) {
        this.distanceCalculator = distanceCalculator;
        this.travelTimeCalculator = travelTimeCalculator;
    }

    public Map<Integer, Route> calculateRoutes(final List<RoutiePlace> routiePlaces) {
        Map<Integer, Route> routeByFromSequence = new HashMap<>();
        Map<Integer, RoutiePlace> routiePlaceBySequence = routiePlaces.stream()
                .collect(Collectors.toMap(RoutiePlace::getSequence, rp -> rp));

        for (int i = 0; i < routiePlaces.size() - 1; i++) {
            RoutiePlace fromRoutiePlace = routiePlaceBySequence.get(i);
            RoutiePlace toRoutiePlace = routiePlaceBySequence.get(i + 1);

            Place fromPlace = fromRoutiePlace.getPlace();
            Place toPlace = toRoutiePlace.getPlace();
            MovingStrategy movingStrategy = MovingStrategy.DRIVING;

            int distance = distanceCalculator.calculateDistance(fromPlace, toPlace, movingStrategy);
            int duration = travelTimeCalculator.calculateTravelTime(fromPlace, toPlace, movingStrategy);

            Route route = new Route(
                    fromRoutiePlace.getSequence(),
                    toRoutiePlace.getSequence(),
                    movingStrategy,
                    duration,
                    distance
            );

            routeByFromSequence.put(fromRoutiePlace.getSequence(), route);
        }

        return routeByFromSequence;
    }
}
