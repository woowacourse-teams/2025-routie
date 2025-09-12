package routie.global.exception.domain;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public record ExceptionDetail(
        HttpStatus status,
        String detail,
        String code
) {

    public static ExceptionDetail fromErrorCode(final ErrorCode errorCode) {
        return new ExceptionDetail(
                errorCode.getHttpStatus(),
                errorCode.getMessage(),
                errorCode.getCode()
        );
    }

    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(status);
        problemDetail.setDetail(detail);
        problemDetail.setProperty("code", code);
        return problemDetail;
    }
}
