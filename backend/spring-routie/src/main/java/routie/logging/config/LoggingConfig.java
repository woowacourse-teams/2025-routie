package routie.logging.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import routie.logging.domain.LogDataBuilder;
import routie.logging.infrastructure.aspect.RequestLoggingAspect;
import routie.logging.infrastructure.interceptor.RequestLoggingInterceptor;
import routie.logging.infrastructure.strategy.DevLoggingStrategy;
import routie.logging.infrastructure.strategy.ProdLoggingStrategy;
import routie.logging.infrastructure.ClientRequestLogger;

@Configuration
@RequiredArgsConstructor
public class LoggingConfig {

    private final ClientRequestLogger clientRequestLogger;

    @Bean
    @Profile("dev")
    public RequestLoggingAspect requestLoggingAspect() {
        return new RequestLoggingAspect(
                clientRequestLogger,
                new LogDataBuilder(new DevLoggingStrategy())
        );
    }

    @Bean
    @Profile("prod")
    public RequestLoggingInterceptor requestLoggingInterceptor() {
        return new RequestLoggingInterceptor(
                clientRequestLogger,
                new LogDataBuilder(new ProdLoggingStrategy())
        );
    }

    @Bean
    @Profile("prod")
    public WebMvcConfigurer interceptorConfigurer(final RequestLoggingInterceptor interceptor) {
        return new WebMvcConfigurer() {
            @Override
            public void addInterceptors(@NonNull final InterceptorRegistry registry) {
                registry.addInterceptor(interceptor)
                        .addPathPatterns("/**")
                        .excludePathPatterns("/favicon.ico", "/swagger-ui/**");
            }
        };
    }
}
