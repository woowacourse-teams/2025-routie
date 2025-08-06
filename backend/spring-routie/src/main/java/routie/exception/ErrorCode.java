package routie.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    BAD_REQUEST("5000", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    KAKAO_LOCAL_API_ERROR("6001", "외부 장소 검색 서비스에 문제가 발생했습니다.", HttpStatus.BAD_GATEWAY),
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
