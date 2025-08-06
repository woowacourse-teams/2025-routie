package routie.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    BAD_REQUEST(
            "5000",
            "잘못된 요청입니다.",
            HttpStatus.BAD_REQUEST
    ),
    KAKAO_DRIVING_ROUTE_API_ERROR(
            "5002",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_DRIVING_ROUTE_API_RESPONSE_EMPTY(
            "5003",
            "경로 계산을 위한 외부 API 응답이 비어 있습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    MOVING_STRATEGY_NOT_SUPPORTED(
            "5004",
            "지원하지 않는 이동 전략입니다.",
            HttpStatus.BAD_REQUEST
    ),
    KAKAO_LOCAL_API_ERROR(
            "6001", 
            "외부 장소 검색 서비스에 문제가 발생했습니다.", 
            HttpStatus.BAD_GATEWAY
    )
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
