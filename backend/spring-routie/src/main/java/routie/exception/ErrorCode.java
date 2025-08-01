package routie.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    BAD_REQUEST("5000", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    ;

    public final String code;
    public final String message;
    public final HttpStatus status;

    ErrorCode(
            final String code,
            final String message,
            final HttpStatus status
    ) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
