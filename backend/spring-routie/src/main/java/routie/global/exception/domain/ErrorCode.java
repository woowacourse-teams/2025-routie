package routie.global.exception.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /**
     * COM: Common
     */
    UNEXPECTED_EXCEPTION(
            "COM-001",
            "서버에서 문제가 발생했습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    FAIL_TO_HANDLE_EXCEPTION(
            "COM-002",
            "서버에서 예외가 발생했지만, 예외 처리 중 문제가 발생했습니다.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INVALID_REQUEST_DATA_VALUE(
            "COM-003",
            "요청에 필요한 데이터의 값이 유효하지 않습니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_REQUEST_DATA_TYPE(
            "COM-004",
            "요청에 필요한 데이터 타입이 일치하지 않습니다.",
            HttpStatus.BAD_REQUEST
    ),
    MISSING_REQUEST_PARAMETER(
            "COM-005",
            "필수 요청 파라미터가 누락되었습니다.",
            HttpStatus.BAD_REQUEST
    ),
    FAIL_TO_READ_REQUEST_BODY(
            "COM-006",
            "요청 바디를 읽는 데에 실패했습니다.",
            HttpStatus.BAD_REQUEST
    ),
    NOT_FOUND(
            "COM-007",
            "요청한 리소스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * PLC: Place
     */
    PLACE_NAME_REQUIRED(
            "PLC-001",
            "장소명은 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_NAME_LENGTH_INVALID(
            "PLC-002",
            "장소명은 1자 이상 30자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_REQUIRED(
            "PLC-003",
            "지번 주소는 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_LENGTH_INVALID(
            "PLC-004",
            "지번 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ROAD_ADDRESS_LENGTH_INVALID(
            "PLC-005",
            "도로명 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LONGITUDE_INVALID(
            "PLC-006",
            "경도는 -180.0 이상 180.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LATITUDE_INVALID(
            "PLC-007",
            "위도는 -90.0 이상 90.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_CLOSED_DAY_NULL(
            "PLC-008",
            "휴무일은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_QUERY_EMPTY(
            "PLC-009",
            "검색어는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_KAKAO(
            "PLC-010",
            "검색 결과의 크기는 1에서 15 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_VWORLD(
            "PLC-011",
            "검색 결과의 크기는 1에서 1,000 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_NOT_FOUND(
            "PLC-012",
            "해당 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND_IN_ROUTIE_SPACE(
            "PLC-013",
            "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND_BY_ID(
            "PLC-014",
            "해당하는 id의 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_PLACE_EXIST(
            "PLC-015",
            "장소가 루티 장소에 등록되어 있습니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * HTG: Hashtag
     */
    HASHTAG_LENGTH_INVALID(
            "HTG-001",
            "해시태그의 길이는 1자 이상 7자 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    HASHTAG_DUPLICATED(
            "HTG-002",
            "장소에 중복된 해시태그가 존재합니다.",
            HttpStatus.BAD_REQUEST
    ),
    HASHTAG_NOT_FOUND(
            "HTG-003",
            "해당 해시태그를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    HASHTAG_NOT_FOUND_IN_ROUTIE_SPACE(
            "HTG-004",
            "루티 스페이스 내에서 해당하는 해시태그를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    HASHTAG_SIZE_INVALID(
            "HTG-005",
            "해시태그 사이즈는 5개 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * SPL: Searched Place
     */
    SEARCHED_PLACE_ID_REQUIRED(
            "SPL-001",
            "검색된 장소 ID는 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_NAME_REQUIRED(
            "SPL-002",
            "장소 이름은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_ADDRESS_REQUIRED(
            "SPL-003",
            "지번은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LONGITUDE_INVALID(
            "SPL-004",
            "유효한 경도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LATITUDE_INVALID(
            "SPL-005",
            "유효한 위도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * RTS: Routie Space
     */
    ROUTIE_SPACE_NAME_EMPTY(
            "RTS-001",
            "루티 스페이스 이름은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_NAME_LENGTH_INVALID(
            "RTS-002",
            "루티 스페이스 이름은 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_IDENTIFIER_PROVIDER_NULL(
            "RTS-003",
            "루티 스페이스 식별자 제공자는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_NOT_FOUND(
            "RTS-004",
            "해당 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER(
            "RTS-005",
            "해당하는 식별자의 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NOT_EXISTS(
            "RTS-006",
            "존재하지 않는 루티 스페이스입니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NO_PERMISSION_TO_MODIFY(
            "RTS-007",
            "루티 스페이스를 수정할 권한이 없습니다.",
            HttpStatus.FORBIDDEN
    ),
    ROUTIE_SPACE_FORBIDDEN_GUEST(
            "RTS-008",
            "해당 루티 스페이스에 접근할 권한이 없는 게스트입니다.",
            HttpStatus.FORBIDDEN
    ),

    /**
     * RTI: Routie
     */
    ROUTIE_PLACE_ALREADY_REGISTERED(
            "RTI-001",
            "이미 등록된 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_NOT_REGISTERED(
            "RTI-002",
            "루티에 등록되지 않은 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ORDER_INVALID(
            "RTI-003",
            "루티 장소 순서는 1 이상의 값이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ENTITY_NULL(
            "RTI-004",
            "장소는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTES_NULL(
            "RTI-005",
            "Routes 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_NULL(
            "RTI-006",
            "RoutiePlace 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_NULL(
            "RTI-007",
            "Route 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACES_NULL(
            "RTI-008",
            "RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_ORIGIN_NULL(
            "RTI-009",
            "출발지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_DESTINATION_NULL(
            "RTI-010",
            "도착지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_MOVING_STRATEGY_NULL(
            "RTI-011",
            "이동 전략은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_START_TIME_NULL(
            "RTI-012",
            "일정 시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_END_TIME_NULL(
            "RTI-013",
            "일정 종료 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_TIME_PERIODS_NULL(
            "RTI-014",
            "TimePeriods는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_END_TIME_BEFORE_START_TIME(
            "RTI-015",
            "일정 종료 시간은 시작 시간보다 빠를 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_START_TIME_NULL(
            "RTI-016",
            "장소 시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_END_TIME_NULL(
            "RTI-017",
            "장소 도착 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIODS_NULL(
            "RTI-018",
            "TimePeriods는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_NULL(
            "RTI-019",
            "TimePeriod는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    VALIDATION_STRATEGY_NULL(
            "RTI-020",
            "ValidationStrategy는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_PLACES_COLLECTION_NULL(
            "RTI-021",
            "유효하지 않은 RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    MOVING_STRATEGY_NOT_SUPPORTED(
            "RTI-022",
            "지원하지 않는 이동 전략입니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * USR: User
     */
    USER_NICKNAME_EMPTY(
            "USR-001",
            "유저 닉네임은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_NICKNAME_LENGTH_INVALID(
            "USR-002",
            "유저 닉네임은 10자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_OAUTH_IDENTIFIER_EMPTY(
            "USR-003",
            "유저 인증 제공 식별자는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_OAUTH_PROVIDER_EMPTY(
            "USR-004",
            "유저 인증 제공자는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    USER_NOT_FOUND(
            "USR-005",
            "해당 유저를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * WRD: Word
     */
    ADJECTIVE_NOT_FOUND(
            "WRD-001",
            "닉네임을 생성하기 위한 형용사가 존재하지 않습니다.",
            HttpStatus.NOT_FOUND
    ),
    NOUN_NOT_FOUND(
            "WRD-002",
            "닉네임을 생성하기 위한 명사가 존재하지 않습니다.",
            HttpStatus.NOT_FOUND
    ),

    /**
     * ATH: Authentication
     */
    OAUTH_PROVIDER_NOT_SUPPORTED(
            "ATH-001",
            "지원하지 않는 ExternalAuthentication 제공자입니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_JWT(
            "ATH-002",
            "인증 정보가 유효하지 않습니다.",
            HttpStatus.UNAUTHORIZED
    ),
    AUTHENTICATION_REQUIRED(
            "ATH-003",
            "인증이 필요합니다.",
            HttpStatus.UNAUTHORIZED
    ),
    INVALID_ROLE(
            "ATH-004",
            "유효하지 않은 Role입니다.",
            HttpStatus.BAD_REQUEST
    ),
    LOGIN_FAILED(
            "ATH-005",
            "아이디 또는 비밀번호가 일치하지 않습니다.",
            HttpStatus.UNAUTHORIZED
    ),
    FORBIDDEN(
            "ATH-006",
            "접근할 권한이 없습니다.",
            HttpStatus.FORBIDDEN
    ),

    /**
     * GST: Guest
     */
    GUEST_NICKNAME_DUPLICATED(
            "GST-001",
            "게스트의 닉네임이 이미 존재합니다.",
            HttpStatus.CONFLICT
    ),
    GUEST_NOT_FOUND(
            "GST-002",
            "해당 게스트를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    GUEST_NICKNAME_EMPTY(
            "GST-003",
            "게스트 닉네임은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    GUEST_NICKNAME_LENGTH_INVALID(
            "GST-004",
            "게스트 닉네임은 10자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * PLK: Place Like
     */
    PLACE_LIKE_DUPLICATED(
            "PLK-001",
            "해당 사용자와 장소에 대한 좋아요가 이미 존재합니다.",
            HttpStatus.CONFLICT
    ),
    PLACE_LIKE_NOT_FOUND(
            "PLK-002",
            "해당 사용자와 장소에 대한 좋아요를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_LIKE_INVALID_OWNER(
            "PLK-003",
            "좋아요는 사용자와 게스트 중 하나에만 연결될 수 있습니다.",
            HttpStatus.BAD_REQUEST
    ),

    /**
     * EXT: External API
     */
    KAKAO_DRIVING_ROUTE_API_ERROR(
            "EXT-001",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    GOOGLE_TRANSIT_ROUTE_API_ERROR(
            "EXT-002",
            "경로 계산을 위한 외부 API 호출 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    GOOGLE_TRANSIT_ROUTE_API_DEPARTURE_TIME_OUT_OF_RANGE(
            "EXT-003",
            "대중교통 Route 계산 시작 시간은 현재로부터 과거 7일부터 미래 100일 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    KAKAO_DRIVING_ROUTE_API_RESPONSE_EMPTY(
            "EXT-004",
            "경로 계산을 위한 외부 API 응답이 비어 있습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_LOCAL_API_ERROR(
            "EXT-005",
            "외부 장소 검색 서비스에 문제가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    V_WORLD_API_ERROR(
            "EXT-006",
            "외부 장소 검색 서비스에 문제가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_OAUTH_API_ERROR(
            "EXT-007",
            "카카오 로그인 처리 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    KAKAO_USER_API_ERROR(
            "EXT-008",
            "카카오에서 유저 정보를 읽어오는 중 오류가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),
    PLACE_SEARCH_SERVICE_UNAVAILABLE(
            "EXT-009",
            "장소 검색 서비스를 사용할 수 없습니다.",
            HttpStatus.SERVICE_UNAVAILABLE
    ),
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    public ProblemDetail toProblemDetail() {
        final ProblemDetail problemDetail = ProblemDetail.forStatus(httpStatus);
        problemDetail.setDetail(message);
        problemDetail.setProperty("code", code);
        return problemDetail;
    }
}
