package routie.global.exception.infrastructure.resolver;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.global.exception.domain.ExceptionResolver;
import routie.global.exception.infrastructure.resolver.expected.ExpectedExceptionResolver;
import routie.global.exception.infrastructure.resolver.unexpected.UnexpectedExceptionResolver;

@Configuration
public class ExceptionResolverConfig {

    @Bean
    @Primary
    public ExceptionResolver exceptionResolverFacade(
            final List<ExpectedExceptionResolver<? extends Exception>> expectedExceptionResolvers,
            final UnexpectedExceptionResolver unexpectedExceptionResolver
    ) {
        return new ExceptionResolverFacade(expectedExceptionResolvers, unexpectedExceptionResolver);
    }
}
