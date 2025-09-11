package routie.global.exception;

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
        log.error("[UNEXPECTED] {}", ex.getMessage(), ex);
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problemDetail.setDetail(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        return problemDetail;
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleRoutieException(final BusinessException ex) {
        log.warn("[EXPECTED] {}", ex.getMessage(), ex);
        return buildProblemDetail(ex.getErrorCode());
    }

    private ProblemDetail buildProblemDetail(final ErrorCode errorCode) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(errorCode.getHttpStatus());
        problemDetail.setDetail(errorCode.getMessage());
        problemDetail.setProperty("code", errorCode.getCode());
        return problemDetail;
    }
}
