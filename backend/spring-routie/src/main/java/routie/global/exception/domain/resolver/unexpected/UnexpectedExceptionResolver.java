package routie.global.exception.domain.resolver.unexpected;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionResolver;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;

/**
 * 예상치 못한 예외를 처리하는 Resolver.
 */
@Slf4j
@Component
public final class UnexpectedExceptionResolver implements ExceptionResolver {

    @Override
    public ExceptionResolvingResponse resolve(final ExceptionResolvingRequest<?> exceptionResolvingRequest) {
        Exception exception = exceptionResolvingRequest.exception();
        log.error("[UNEXPECTED] {}", exception.getMessage(), exception);
        return ExceptionResolvingResponse.fromErrorCode(ErrorCode.UNEXPECTED_EXCEPTION);
    }
}
