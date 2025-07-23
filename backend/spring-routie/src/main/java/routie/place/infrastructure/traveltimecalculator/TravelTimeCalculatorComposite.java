package routie.place.infrastructure.traveltimecalculator;

import java.util.List;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;
import routie.place.domain.TravelTimeCalculator;

public class TravelTimeCalculatorComposite implements TravelTimeCalculator {

    private final List<TravelTimeCalculator> travelTimeCalculators;

    public TravelTimeCalculatorComposite(final List<TravelTimeCalculator> drivingTravelTimeCalculator) {
        this.travelTimeCalculators = drivingTravelTimeCalculator;
    }

    @Override
    public boolean supportsStrategy(final MovingStrategy strategy) {
        return strategy != null;
    }

    @Override
    public int calculateTravelTime(final Place from, final Place to, final MovingStrategy strategy) {
        return selectTravelTimeCalculator(strategy)
                .calculateTravelTime(from, to, strategy);
    }

    private TravelTimeCalculator selectTravelTimeCalculator(final MovingStrategy strategy) {
        return travelTimeCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(strategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 이동 방식입니다: " + strategy));
    }
}
