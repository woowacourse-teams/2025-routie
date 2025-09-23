package routie.global.exception.infrastructure.expected.handlermethod.validation;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

/**
 * HandlerMethod 의 필수 요청 파라메터가 누락된 경우 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>@RequestParam(required = true) Long page 에서 page 가 누락된 경우.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 * @see org.springframework.web.bind.annotation.RequestParam
 */
@RestControllerAdvice
public class MissingServletRequestParameterExceptionHandler {

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ProblemDetail handle(final MissingServletRequestParameterException exception) {
        ExceptionLogger.logExpectedException(exception);
        return ErrorCode.MISSING_REQUEST_PARAMETER.toProblemDetail();
    }
}
