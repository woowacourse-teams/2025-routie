package routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestRouteApiConfig {

    @Bean
    @Primary
    public KakaoDrivingRouteApiClient kakaoDrivingRouteApiClient() {
        return new FakeKakaoDrivingRouteApiClient();
    }
}
