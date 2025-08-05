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
    ROUTE_CALCULATION_SIZE_TOO_SMALL(
            "5001",
            "경로 계산을 위한 장소의 개수가 충분하지 않습니다. 최소 2개 이상의 장소가 필요합니다.",
            HttpStatus.BAD_REQUEST
    ),
    KAKAO_DRIVING_ROUTE_API_ERROR(
            "5002",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    KAKAO_DRIVING_ROUTE_API_RESPONSE_EMPTY(
            "5003",
            "경로 계산을 위한 외부 API 응답이 비어 있습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    MOVING_STRATEGY_NOT_SUPPORTED(
            "5004",
            "지원하지 않는 이동 전략입니다.",
            HttpStatus.BAD_REQUEST
    );

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
