package routie.global.exception.domain;

import org.springframework.http.HttpStatus;

public record ExceptionResolvingResponse(
        HttpStatus status,
        String detail,
        String code
) {

    public static ExceptionResolvingResponse fromErrorCode(final ErrorCode errorCode) {
        return new ExceptionResolvingResponse(
                errorCode.getHttpStatus(),
                errorCode.getMessage(),
                errorCode.getCode()
        );
    }
}
