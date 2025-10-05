package routie.global.exception.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /**
     * 0XXX: COMMON
     */
    UNEXPECTED_EXCEPTION(
            "0000",
            "서버에서 문제가 발생했습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    FAIL_TO_HANDLE_EXCEPTION(
            "0001",
            "서버에서 예외가 발생했지만, 예외 처리 중 문제가 발생했습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INVALID_REQUEST_DATA_VALUE(
            "0002",
            "요청에 필요한 데이터의 값이 유효하지 않습니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_REQUEST_DATA_TYPE(
            "0003",
            "요청에 필요한 데이터 타입이 일치하지 않습니다.",
            HttpStatus.BAD_REQUEST
    ),
    MISSING_REQUEST_PARAMETER(
            "0004",
            "필수 요청 파라미터가 누락되었습니다.",
            HttpStatus.BAD_REQUEST
    ),
    FAIL_TO_READ_REQUEST_BODY(
            "0005",
            "요청 바디를 읽는 데에 실패했습니다.",
            HttpStatus.BAD_REQUEST
    ),
    NOT_FOUND(
            "0006",
            "요청한 리소스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * 1XXX: Place domain
     */
    // Place
    PLACE_NAME_REQUIRED(
            "1000",
            "장소명은 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_NAME_LENGTH_INVALID(
            "1001",
            "장소명은 1자 이상 30자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_REQUIRED(
            "1002",
            "지번 주소는 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_LENGTH_INVALID(
            "1003",
            "지번 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ROAD_ADDRESS_LENGTH_INVALID(
            "1004",
            "도로명 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LONGITUDE_INVALID(
            "1005",
            "경도는 -180.0 이상 180.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LATITUDE_INVALID(
            "1006",
            "위도는 -90.0 이상 90.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_CLOSED_DAY_NULL(
            "1011",
            "휴무일은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),

    // SearchedPlace Validation
    SEARCHED_PLACE_ID_REQUIRED(
            "1020",
            "검색된 장소 ID는 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_NAME_REQUIRED(
            "1021",
            "장소 이름은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_ADDRESS_REQUIRED(
            "1022",
            "지번은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LONGITUDE_INVALID(
            "1023",
            "유효한 경도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LATITUDE_INVALID(
            "1024",
            "유효한 위도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),

    // Place Search
    SEARCH_QUERY_EMPTY(
            "1030",
            "검색어는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_KAKAO(
            "1031",
            "검색 결과의 크기는 1에서 15 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_VWORLD(
            "1032",
            "검색 결과의 크기는 1에서 1,000 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_SEARCH_SERVICE_UNAVAILABLE(
            "1050",
            "장소 검색 서비스를 사용할 수 없습니다.",
            HttpStatus.SERVICE_UNAVAILABLE
    ),

    // Place Business Logic
    PLACE_NOT_FOUND(
            "1100",
            "해당 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND_IN_ROUTIE_SPACE(
            "1101",
            "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND_BY_ID(
            "1102",
            "해당하는 id의 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_PLACE_EXIST(
            "1103",
            "장소가 루티 장소에 등록되어 있습니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * 2XXX: Routie Space domain
     */
    // RoutieSpace
    ROUTIE_SPACE_NAME_EMPTY(
            "2000",
            "루티 스페이스 이름은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_NAME_LENGTH_INVALID(
            "2001",
            "루티 스페이스 이름은 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_IDENTIFIER_PROVIDER_NULL(
            "2002",
            "루티 스페이스 식별자 제공자는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),

    // RoutieSpace Business Logic
    ROUTIE_SPACE_NOT_FOUND(
            "2100",
            "해당 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER(
            "2101",
            "해당하는 식별자의 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NOT_EXISTS(
            "2102",
            "존재하지 않는 루티 스페이스입니다.",
            HttpStatus.NOT_FOUND
    ),

    // RoutieSpace Authorization
    ROUTIE_SPACE_NO_PERMISSION_TO_MODIFY(
            "2200",
            "루티 스페이스를 수정할 권한이 없습니다.",
            HttpStatus.FORBIDDEN
    ),
    ROUTIE_SPACE_FORBIDDEN_GUEST(
            "2201",
            "해당 루티 스페이스에 접근할 권한이 없는 게스트 사용자입니다.",
            HttpStatus.FORBIDDEN
    ),

    /**
     * 3XXX: Routie domain
     */
    // Routie
    ROUTIE_PLACE_ALREADY_REGISTERED(
            "3000",
            "이미 등록된 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_NOT_REGISTERED(
            "3001",
            "루티에 등록되지 않은 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ORDER_INVALID(
            "3002",
            "루티 장소 순서는 1 이상의 값이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ENTITY_NULL(
            "3003",
            "장소는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTES_NULL(
            "3004",
            "Routes 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_NULL(
            "3005",
            "RoutiePlace 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_NULL(
            "3006",
            "Route 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACES_NULL(
            "3007",
            "RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),

    // Route
    ROUTE_ORIGIN_NULL(
            "3020",
            "출발지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_DESTINATION_NULL(
            "3021",
            "도착지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_MOVING_STRATEGY_NULL(
            "3022",
            "이동 전략은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_START_TIME_NULL(
            "3023",
            "일정 시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_END_TIME_NULL(
            "3024",
            "일정 종료 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_TIME_PERIODS_NULL(
            "3025",
            "TimePeriods는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_END_TIME_BEFORE_START_TIME(
            "3026",
            "일정 종료 시간은 시작 시간보다 빠를 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),

    // TimePeriod Validation
    TIME_PERIOD_START_TIME_NULL(
            "3030",
            "장소 시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_END_TIME_NULL(
            "3031",
            "장소 도착 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIODS_NULL(
            "3032",
            "TimePeriods는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_NULL(
            "3033",
            "TimePeriod는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),

    // ValidationStrategy
    VALIDATION_STRATEGY_NULL(
            "3040",
            "ValidationStrategy는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_PLACES_COLLECTION_NULL(
            "3041",
            "유효하지 않은 RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    MOVING_STRATEGY_NOT_SUPPORTED(
            "3042",
            "지원하지 않는 이동 전략입니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * 4XXX: User domain
     */
    // User
    USER_NICKNAME_EMPTY(
            "4000",
            "사용자 닉네임은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_NICKNAME_LENGTH_INVALID(
            "4001",
            "사용자 닉네임은 10자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_OAUTH_IDENTIFIER_EMPTY(
            "4002",
            "사용자 인증 제공 식별자는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_OAUTH_PROVIDER_EMPTY(
            "4003",
            "사용자 인증 제공자는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_NOT_FOUND(
            "4100",
            "해당 사용자를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * 5XXX: Word domain
     */
    ADJECTIVE_NOT_FOUND(
            "5000",
            "닉네임을 생성하기 위한 형용사가 존재하지 않습니다.",
            HttpStatus.NOT_FOUND
    ),
    NOUN_NOT_FOUND(
            "5001",
            "닉네임을 생성하기 위한 명사가 존재하지 않습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * 6XXXX: Authentication domain
     */
    // ExternalAuthentication
    OAUTH_PROVIDER_NOT_SUPPORTED(
            "6000",
            "지원하지 않는 ExternalAuthentication 제공자입니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_JWT(
            "6001",
            "인증 정보가 유효하지 않습니다.",
            HttpStatus.UNAUTHORIZED
    ),
    AUTHENTICATION_REQUIRED(
            "6002",
            "인증이 필요합니다.",
            HttpStatus.UNAUTHORIZED
    ),
    INVALID_ROLE(
            "6003",
            "유효하지 않은 Role입니다.",
            HttpStatus.BAD_REQUEST
    ),
    LOGIN_FAILED(
            "6004",
            "아이디 또는 비밀번호가 일치하지 않습니다.",
            HttpStatus.UNAUTHORIZED
    ),
    FORBIDDEN(
            "6005",
            "접근할 권한이 없습니다.",
            HttpStatus.FORBIDDEN
    ),

    /**
     * 7XXX: Guest API
     */
    GUEST_NICKNAME_DUPLICATED(
            "7000",
            "게스트의 닉네임이 이미 존재합니다.",
            HttpStatus.CONFLICT
    ),
    GUEST_NOT_FOUND(
            "7001",
            "해당 비회원 사용자를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * 8XXX: Place Like API
     */
    PLACE_LIKE_DUPLICATED(
            "8000",
            "해당 사용자와 장소에 대한 좋아요가 이미 존재합니다.",
            HttpStatus.CONFLICT
    ),
    PLACE_LIKE_NOT_FOUND(
            "8001",
            "해당 사용자와 장소에 대한 좋아요를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    INVALID_PLACE_LIKE_OWNER(
            "8003",
            "좋아요는 사용자와 게스트 중 하나에만 연결될 수 있습니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * 9XXX: External API
     */
    KAKAO_DRIVING_ROUTE_API_ERROR(
            "9000",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    GOOGLE_TRANSIT_ROUTE_API_ERROR(
            "9001",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    GOOGLE_TRANSIT_ROUTE_API_DEPARTURE_TIME_OUT_OF_RANGE(
            "9002",
            "대중교통 Route 계산 시작 시간은 현재로부터 과거 7일부터 미래 100일 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    KAKAO_DRIVING_ROUTE_API_RESPONSE_EMPTY(
            "9010",
            "경로 계산을 위한 외부 API 응답이 비어 있습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_LOCAL_API_ERROR(
            "9011",
            "외부 장소 검색 서비스에 문제가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    V_WORLD_API_ERROR(
            "9012",
            "외부 장소 검색 서비스에 문제가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_OAUTH_API_ERROR(
            "9013",
            "카카오 로그인 처리 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_USER_API_ERROR(
            "9014",
            "카카오에서 사용자 정보를 읽어오는 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(httpStatus);
        problemDetail.setDetail(message);
        problemDetail.setProperty("code", code);
        return problemDetail;
    }
}
