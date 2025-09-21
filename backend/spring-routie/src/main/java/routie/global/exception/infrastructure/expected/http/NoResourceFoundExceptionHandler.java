package routie.global.exception.infrastructure.expected.http;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import routie.global.exception.domain.ErrorCode;

/**
 * 요청한 리소스를 찾을 수 없을 때 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>없는 uri로 요청을 보내는 경우.</li>
 * </ul>
 */
@RestControllerAdvice
public class NoResourceFoundExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handle() {
        return ErrorCode.NOT_FOUND.toProblemDetail();
    }
}
