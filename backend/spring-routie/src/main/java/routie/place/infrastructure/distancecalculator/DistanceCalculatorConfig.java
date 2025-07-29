package routie.place.infrastructure.distancecalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.place.domain.DistanceCalculator;

@Configuration
public class DistanceCalculatorConfig {

    @Bean
    @Primary
    public DistanceCalculator distanceCalculator(final List<DistanceCalculator> distanceCalculators) {
        return new DistanceCalculatorComposite(distanceCalculators);
    }
}
