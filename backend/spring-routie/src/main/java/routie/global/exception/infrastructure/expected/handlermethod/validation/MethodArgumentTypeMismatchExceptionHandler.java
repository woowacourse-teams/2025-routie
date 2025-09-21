package routie.global.exception.infrastructure.expected.handlermethod.validation;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

/**
 * HandlerMethod 에 파라메터 바인딩 시, 타입이 일치하지 않는 경우 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>@RequestParam Long page 필드에 문자열 바인딩 시도 시.</li>
 * <li>@PathVariable Long id 필드에 문자열 바인딩 시도 시.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 */
@RestControllerAdvice
public class MethodArgumentTypeMismatchExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handle(final MethodArgumentTypeMismatchException exception) {
        ExceptionLogger.logExpectedException(exception);
        return ErrorCode.INVALID_REQUEST_DATA_TYPE.toProblemDetail();
    }
}
