package routie.global.exception.infrastructure.resolver.unexpected;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

/**
 * 예상치 못한 예외를 처리하는 Resolver.
 */
@Slf4j
@Component
public class UnexpectedExceptionResolver implements ExceptionResolver {

    @Override
    public ExceptionDetail resolve(final Exception exception) {
        log.error("[UNEXPECTED] {}", exception.getMessage(), exception);
        return ExceptionDetail.fromErrorCode(ErrorCode.UNEXPECTED_EXCEPTION);
    }

    @Override
    public Class<? extends Exception> getResolvableException() {
        return Exception.class;
    }
}
