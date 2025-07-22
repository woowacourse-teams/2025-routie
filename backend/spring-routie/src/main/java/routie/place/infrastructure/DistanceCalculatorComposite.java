package routie.place.infrastructure;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import routie.place.domain.DistanceCalculator;
import routie.place.domain.MovingStrategy;
import routie.place.domain.Place;

@Primary
@Component
public class DistanceCalculatorComposite implements DistanceCalculator {

    private final List<DistanceCalculator> distanceCalculators;

    public DistanceCalculatorComposite(
            @Qualifier("fakeDrivingDistanceCalculator") final DistanceCalculator fakeDrivingDistanceCalculator
    ) {
        this.distanceCalculators = new ArrayList<>();
        this.distanceCalculators.add(fakeDrivingDistanceCalculator);
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
