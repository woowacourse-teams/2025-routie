package routie.global.exception.application;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;
import routie.global.exception.domain.resolver.unexpected.UnexpectedExceptionResolver;

@Slf4j
@Service
public class ExceptionResolverService {

    private final Map<Class<? extends Exception>, ExpectedExceptionResolver<? extends Exception>> expectedExceptionResolvers;
    private final UnexpectedExceptionResolver unexpectedExceptionResolvers;

    public ExceptionResolverService(
            final List<ExpectedExceptionResolver<? extends Exception>> expectedExceptionResolvers,
            final UnexpectedExceptionResolver unexpectedExceptionResolvers
    ) {
        this.expectedExceptionResolvers = expectedExceptionResolvers.stream()
                .collect(Collectors.toMap(
                        ExpectedExceptionResolver::getResolvableException,
                        Function.identity()
                ));
        this.unexpectedExceptionResolvers = unexpectedExceptionResolvers;
    }

    public ExceptionDetail resolve(final Exception exception) {
        try {
            return findMostSpecificResolver(exception)
                    .map(expectedExceptionResolver -> expectedExceptionResolver.resolve(exception))
                    .orElseGet(() -> unexpectedExceptionResolvers.resolve(exception));
        } catch (final Exception e) {
            log.error("[FAIL TO RESOLVE] unexpected error occurred while resolving '{}' due to a '{}'.",
                    exception.getClass().getSimpleName(),
                    e.getClass().getSimpleName(),
                    e
            );
            return ExceptionDetail.fromErrorCode(ErrorCode.FAIL_TO_HANDLE_EXCEPTION);
        }
    }

    private Optional<ExpectedExceptionResolver<? extends Exception>> findMostSpecificResolver(
            final Exception exception
    ) {
        Class<?> currentExceptionClass = exception.getClass();

        while (currentExceptionClass != null && Exception.class.isAssignableFrom(currentExceptionClass)) {
            ExpectedExceptionResolver<? extends Exception> resolver = expectedExceptionResolvers.get(
                    currentExceptionClass
            );
            if (resolver != null) {
                return Optional.of(resolver);
            }
            currentExceptionClass = currentExceptionClass.getSuperclass();
        }
        return Optional.empty();
    }
}
