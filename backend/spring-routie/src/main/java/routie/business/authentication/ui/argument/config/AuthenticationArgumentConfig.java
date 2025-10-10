package routie.business.authentication.ui.argument.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import routie.business.authentication.ui.argument.interceptor.AuthenticationInterceptor;
import routie.business.authentication.ui.argument.resolver.AuthenticatedParticipantArgumentResolver;

@Configuration
@RequiredArgsConstructor
public class AuthenticationArgumentConfig implements WebMvcConfigurer {

    private final AuthenticationInterceptor authenticationInterceptor;
    private final AuthenticatedParticipantArgumentResolver authenticatedParticipantArgumentResolver;

    @Override
    public void addInterceptors(final InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor)
                .addPathPatterns("/**");
    }

    @Override
    public void addArgumentResolvers(final List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authenticatedParticipantArgumentResolver);
    }
}
