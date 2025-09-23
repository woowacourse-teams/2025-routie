package routie.global.exception.infrastructure.expected.handlermethod.validation;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

/**
 * HandlerMethod 에 파라메터 바인딩 시, 검증에 실패한 경우 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>@Valid 어노테이션이 붙은 필드 검증이 실패했을 때.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 * @see jakarta.validation.Valid
 */
@RestControllerAdvice
public class HandlerMethodValidationExceptionHandler {

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ProblemDetail handle(final HandlerMethodValidationException exception) {
        ExceptionLogger.logExpectedException(exception);
        return ErrorCode.INVALID_REQUEST_DATA_VALUE.toProblemDetail();
    }
}
