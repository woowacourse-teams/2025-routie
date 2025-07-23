package routie.place.infrastructure.distancecalculator;

import java.util.ArrayList;
import java.util.List;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

public class DistanceCalculatorComposite implements DistanceCalculator {

    private final List<DistanceCalculator> distanceCalculators;

    public DistanceCalculatorComposite(final List<DistanceCalculator> drivingDistanceCalculators) {
        this.distanceCalculators = new ArrayList<>(drivingDistanceCalculators);
    }

    @Override
    public boolean supportsStrategy(final MovingStrategy strategy) {
        return strategy != null;
    }

    @Override
    public int calculateDistance(final Place from, final Place to, final MovingStrategy strategy) {
        return selectDistanceCalculator(strategy).calculateDistance(from, to, strategy);
    }

    private DistanceCalculator selectDistanceCalculator(final MovingStrategy strategy) {
        return distanceCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(strategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 이동 방식입니다: " + strategy));
    }
}
