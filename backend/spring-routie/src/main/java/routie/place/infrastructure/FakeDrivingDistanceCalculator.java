package routie.place.infrastructure;

import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

@Component("fakeDrivingDistanceCalculator")
public class FakeDrivingDistanceCalculator implements DistanceCalculator {

    @Override
    public boolean supportsStrategy(final MovingStrategy strategy) {
        return strategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public int calculateDistance(final Place from, final Place to, final MovingStrategy strategy) {
        return 1_000;
    }
}
