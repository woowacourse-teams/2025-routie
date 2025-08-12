package routie.logging.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import routie.logging.domain.LogDataBuilder;
import routie.logging.infrastructure.interceptor.RequestLoggingInterceptor;
import routie.logging.service.ClientRequestLogger;

@Configuration
@Profile("prod")
@RequiredArgsConstructor
public class ProdLoggingConfig implements WebMvcConfigurer {

    private final ClientRequestLogger clientRequestLogger;

    @Bean
    public RequestLoggingInterceptor requestLoggingInterceptor(
            final ClientRequestLogger clientRequestLogger
    ) {
        return new RequestLoggingInterceptor(
                clientRequestLogger,
                new LogDataBuilder(new ProdLoggingStrategy())
        );
    }

    @Override
    public void addInterceptors(final InterceptorRegistry registry) {
        registry.addInterceptor(requestLoggingInterceptor(clientRequestLogger))
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/favicon.ico",
                        "/swagger-ui/**"
                );
    }
}
