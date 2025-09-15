package routie.global.exception.domain.resolver.unexpected;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionContext;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

/**
 * 예상치 못한 예외를 처리하는 Resolver.
 */
@Slf4j
@Component
public final class UnexpectedExceptionResolver implements ExceptionResolver {

    @Override
    public ExceptionDetail resolve(final ExceptionContext<?> exceptionContext) {
        Exception exception = exceptionContext.exception();
        log.error("[UNEXPECTED] {}", exception.getMessage(), exception);
        return ExceptionDetail.fromErrorCode(ErrorCode.UNEXPECTED_EXCEPTION);
    }
}
