package routie.routie.domain.route;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.place.domain.TravelTimeCalculator;
import routie.routie.domain.RoutiePlace;

@Component
@RequiredArgsConstructor
public class RouteCalculator {

    private final DistanceCalculator distanceCalculator;
    private final TravelTimeCalculator travelTimeCalculator;

    public Map<RoutiePlace, Route> calculateRoutes(final List<RoutiePlace> routiePlaces) {
        LinkedHashMap<RoutiePlace, Route> routeByFromRoutiePlace = new LinkedHashMap<>();

        for (int sequence = 0; sequence < routiePlaces.size() - 1; sequence++) {
            RoutiePlace fromRoutiePlace = routiePlaces.get(sequence);
            RoutiePlace toRoutiePlace = routiePlaces.get(sequence + 1);

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

            routeByFromRoutiePlace.put(fromRoutiePlace, route);
        }

        return routeByFromRoutiePlace;
    }
}
