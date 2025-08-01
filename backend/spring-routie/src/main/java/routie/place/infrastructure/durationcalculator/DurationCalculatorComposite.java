package routie.place.infrastructure.durationcalculator;

import java.util.List;
import routie.place.domain.DurationCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

public class DurationCalculatorComposite implements DurationCalculator {

    private final List<DurationCalculator> durationCalculators;

    public DurationCalculatorComposite(final List<DurationCalculator> durationCalculators) {
        this.durationCalculators = durationCalculators;
    }

    @Override
    public boolean supportsStrategy(final MovingStrategy movingStrategy) {
        return movingStrategy != null;
    }

    @Override
    public int calculateDuration(final Place from, final Place to, final MovingStrategy movingStrategy) {
        return selectDurationCalculator(movingStrategy)
                .calculateDuration(from, to, movingStrategy);
    }

    private DurationCalculator selectDurationCalculator(final MovingStrategy movingStrategy) {
        return durationCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(movingStrategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 이동 방식입니다: " + movingStrategy));
    }
}
