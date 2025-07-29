package routie.place.infrastructure.traveltimecalculator;

import org.springframework.stereotype.Component;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.place.domain.TravelTimeCalculator;

@Component
public class FakeDrivingTravelTimeCalculator implements TravelTimeCalculator {

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public int calculateTravelTime(final Place from, final Place to, final MovingStrategy movingStrategy) {
        return 100;
    }
}
