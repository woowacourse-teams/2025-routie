package routie.exception;

import org.springframework.http.HttpStatus;

public class RoutieException extends RuntimeException {

    private final ErrorCode errorCode;

    public RoutieException(final ErrorCode errorCode) {
        super(errorCode.message);
        this.errorCode = errorCode;
    }

    public RoutieException(final ErrorCode errorCode, final Throwable cause) {
        super(errorCode.message, cause);
        this.errorCode = errorCode;
    }

    public String getCode() {
        return errorCode.code;
    }

    public HttpStatus getStatus() {
        return errorCode.status;
    }
}
