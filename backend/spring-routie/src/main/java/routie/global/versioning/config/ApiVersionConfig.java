package routie.global.versioning.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import routie.global.versioning.infrastructure.ApiVersionArgumentResolver;
import routie.global.versioning.infrastructure.ApiVersionInterceptor;

@Configuration
@RequiredArgsConstructor
public class ApiVersionConfig implements WebMvcConfigurer {

    private final ApiVersionInterceptor apiVersionInterceptor;
    private final ApiVersionArgumentResolver apiVersionArgumentResolver;

    @Override
    public void addArgumentResolvers(final List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(apiVersionArgumentResolver);
    }

    @Override
    public void addInterceptors(final InterceptorRegistry registry) {
        registry.addInterceptor(apiVersionInterceptor)
                .addPathPatterns("/api/**");
    }
}
