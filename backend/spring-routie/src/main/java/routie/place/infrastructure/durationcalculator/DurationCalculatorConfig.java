package routie.place.infrastructure.durationcalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.place.domain.DurationCalculator;

@Configuration
public class DurationCalculatorConfig {

    @Bean
    @Primary
    public DurationCalculator durationCalculator(final List<DurationCalculator> durationCalculators) {
        return new DurationCalculatorComposite(durationCalculators);
    }
}
