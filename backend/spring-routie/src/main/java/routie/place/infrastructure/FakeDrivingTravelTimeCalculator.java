package routie.place.infrastructure;

import org.springframework.stereotype.Component;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.place.domain.TravelTimeCalculator;

@Component("fakeDrivingTravelTimeCalculator")
public class FakeDrivingTravelTimeCalculator implements TravelTimeCalculator {

    @Override
    public boolean supportsStrategy(final MovingStrategy strategy) {
        return strategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public int calculateTravelTime(final Place from, final Place to, final MovingStrategy strategy) {
        return 100 * 60;
    }
}
