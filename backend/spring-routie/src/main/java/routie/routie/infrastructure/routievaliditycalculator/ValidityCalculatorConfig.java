package routie.routie.infrastructure.routievaliditycalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.routie.domain.ValidityCalculator;

@Configuration
public class ValidityCalculatorConfig {

    @Bean
    @Primary
    public ValidityCalculator validityCalculator(
            final List<ValidityCalculator> validityCalculators
    ) {
        return new ValidityCalculatorComposite(validityCalculators);
    }
}
