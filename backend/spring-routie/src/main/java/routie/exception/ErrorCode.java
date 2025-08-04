package routie.exception;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public enum ErrorCode {

    BAD_REQUEST("5000", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    ;

    public final String code;
    public final String message;
    public final HttpStatus httpStatus;
}
