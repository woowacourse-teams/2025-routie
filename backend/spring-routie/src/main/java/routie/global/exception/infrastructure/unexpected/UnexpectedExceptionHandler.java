package routie.global.exception.infrastructure.unexpected;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

@RestControllerAdvice
public class UnexpectedExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ProblemDetail handle(final Exception exception) {
        ExceptionLogger.logUnexpectedException(exception);
        return ErrorCode.UNEXPECTED_EXCEPTION.toProblemDetail();
    }
}
