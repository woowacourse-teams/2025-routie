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
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy != null;
    }

    @Override
    public int calculateDistance(final Place from, final Place to, final MovingStrategy movingStrategy) {
        return selectDistanceCalculator(movingStrategy).calculateDistance(from, to, movingStrategy);
    }

    private DistanceCalculator selectDistanceCalculator(final MovingStrategy movingStrategy) {
        return distanceCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(movingStrategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 이동 방식입니다: " + movingStrategy));
    }
}
