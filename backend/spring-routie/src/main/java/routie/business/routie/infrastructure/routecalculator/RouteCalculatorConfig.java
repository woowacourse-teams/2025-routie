package routie.business.routie.infrastructure.routecalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.business.routie.domain.route.RouteCalculator;

@Configuration
public class RouteCalculatorConfig {

    @Bean
    @Primary
    public RouteCalculator routeCalculator(final List<RouteCalculator> routeCalculators) {
        return new RouteCalculatorComposite(routeCalculators);
    }
}
