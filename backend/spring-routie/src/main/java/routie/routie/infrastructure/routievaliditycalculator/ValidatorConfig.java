package routie.routie.infrastructure.routievaliditycalculator;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.routie.domain.routievalidator.RoutieValidator;

@Configuration
public class ValidatorConfig {

    @Bean
    @Primary
    public RoutieValidator validator(final List<RoutieValidator> validators) {
        return new ValidatorComposite(validators);
    }
}
