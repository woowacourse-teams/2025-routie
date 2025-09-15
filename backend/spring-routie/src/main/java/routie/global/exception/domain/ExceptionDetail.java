package routie.global.exception.domain;

import org.springframework.http.HttpStatus;

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
}
