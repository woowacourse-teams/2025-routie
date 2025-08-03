package routie.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnExpectedException(final Exception ex) {
        log.error("[UNEXPECTED] ", ex);
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problemDetail.setDetail(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        return problemDetail;
    }

    @ExceptionHandler(RoutieException.class)
    public ProblemDetail handleRoutieException(final RoutieException ex) {
        log.warn("[EXPECTED] ", ex);
        ProblemDetail problemDetail = ProblemDetail.forStatus(ex.getStatus());
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setProperty("code", ex.getCode());
        return problemDetail;
    }
}
