package routie.global.exception.infrastructure.expected.business;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

/**
 * 비즈니스 로직 수행 과정에서 발생하는 모든 예외를 처리하는 예외 핸들러.
 */
@RestControllerAdvice
public class BusinessExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handle(final BusinessException exception) {
        ExceptionLogger.logExpectedException(exception);
        return exception.getErrorCode().toProblemDetail();
    }
}
