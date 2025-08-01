package routie.place.infrastructure.durationcalculator;

import org.springframework.stereotype.Component;
import routie.place.domain.DurationCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

@Component
public class FakeDrivingDurationCalculator implements DurationCalculator {

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy.equals(MovingStrategy.DRIVING);
    }

    @Override
    public int calculateDuration(final Place from, final Place to, final MovingStrategy movingStrategy) {
        return 100;
    }
}
