package routie.place.infrastructure.distancecalculator;

import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

@Component
public class FakeDrivingDistanceCalculator implements DistanceCalculator {

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public int calculateDistance(final Place from, final Place to, final MovingStrategy movingStrategy) {
        return 1_000;
    }
}
