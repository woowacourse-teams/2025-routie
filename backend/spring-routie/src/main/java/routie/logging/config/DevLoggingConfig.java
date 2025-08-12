package routie.logging.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import routie.logging.infrastructure.aspect.RequestLoggingAspect;
import routie.logging.domain.LogDataBuilder;
import routie.logging.service.ClientRequestLogger;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class DevLoggingConfig {

    private final ClientRequestLogger clientRequestLogger;

    @Bean
    public RequestLoggingAspect requestLoggingAspect() {
        return new RequestLoggingAspect(
                clientRequestLogger,
                new LogDataBuilder(new DevLoggingStrategy())
        );
    }
}
