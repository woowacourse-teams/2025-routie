package routie.place.infrastructure.traveltimecalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.place.domain.TravelTimeCalculator;

@Configuration
public class TravelTimeCalculatorConfig {

    @Bean
    @Primary
    public TravelTimeCalculator travelTimeCalculator(final List<TravelTimeCalculator> travelTimeCalculators) {
        return new TravelTimeCalculatorComposite(travelTimeCalculators);
    }
}
