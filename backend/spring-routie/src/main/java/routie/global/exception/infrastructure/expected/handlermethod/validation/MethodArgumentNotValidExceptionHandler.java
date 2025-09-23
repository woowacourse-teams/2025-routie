package routie.global.exception.infrastructure.expected.handlermethod.validation;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

/**
 * {@code @Valid} 어노테이션을 사용한 요청 바디 검증에 실패한 경우 발생하는 예외를 처리하는 핸들러입니다.
 *
 * @see org.springframework.web.bind.MethodArgumentNotValidException
 * @see jakarta.validation.Valid
 */
@RestControllerAdvice
public class MethodArgumentNotValidExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handle(final MethodArgumentNotValidException exception) {
        ExceptionLogger.logExpectedException(exception);
        return ErrorCode.INVALID_REQUEST_DATA_VALUE.toProblemDetail();
    }
}
