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
    ),
    V_WORLD_API_ERROR(
            "6002",
            "외부 장소 검색 서비스에 문제가 발생했습니다.",
            HttpStatus.BAD_GATEWAY
    ),

    // Place Domain Validation Errors
    PLACE_CLOSED_DAY_NULL(
            "7001",
            "휴무일은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_STAY_DURATION_INVALID(
            "7002",
            "체류 시간은 0분 이상 1440분 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_NAME_REQUIRED(
            "7003",
            "장소명은 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_NAME_LENGTH_INVALID(
            "7004",
            "장소명은 1자 이상 30자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ROAD_ADDRESS_LENGTH_INVALID(
            "7005",
            "도로명 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_REQUIRED(
            "7006",
            "지번 주소는 필수입니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_ADDRESS_LENGTH_INVALID(
            "7007",
            "지번 주소는 1자 이상 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LONGITUDE_INVALID(
            "7008",
            "경도는 -180.0 이상 180.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_LATITUDE_INVALID(
            "7009",
            "위도는 -90.0 이상 90.0 이하이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_BUSINESS_HOURS_INCOMPLETE(
            "7010",
            "영업 시작 시간과 종료 시간은 함께 존재해야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_BREAK_TIME_INCOMPLETE(
            "7011",
            "브레이크 타임 시작 시간과 종료 시간은 함께 존재해야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    PLACE_BREAK_TIME_OUTSIDE_BUSINESS_HOURS(
            "7012",
            "브레이크 타임은 영업 시간 내에 있어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),

    // SearchedPlace Domain Validation Errors
    SEARCHED_PLACE_ID_REQUIRED(
            "7020",
            "검색된 장소 ID는 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_NAME_REQUIRED(
            "7021",
            "장소 이름은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_ADDRESS_REQUIRED(
            "7022",
            "지번은 필수값입니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LONGITUDE_INVALID(
            "7023",
            "유효한 경도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCHED_PLACE_LATITUDE_INVALID(
            "7024",
            "유효한 위도 값이 아닙니다.",
            HttpStatus.BAD_REQUEST
    ),

    // Place Service Errors
    ROUTIE_SPACE_NOT_FOUND(
            "7030",
            "해당 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND(
            "7031",
            "해당 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),

    // Place Search Errors
    SEARCH_QUERY_EMPTY(
            "7040",
            "검색어는 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_KAKAO(
            "7041",
            "검색 결과의 크기는 1에서 15 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    SEARCH_SIZE_INVALID_VWORLD(
            "7042",
            "검색 결과의 크기는 1에서 1,000 사이여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),

    ROUTIE_SPACE_IDENTIFIER_PROVIDER_NULL(
            "8001",
            "루티 스페이스 식별자 제공자는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_NAME_EMPTY(
            "8002",
            "루티 스페이스 이름은 비어있을 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_SPACE_NAME_LENGTH_INVALID(
            "8003",
            "루티 스페이스 이름은 50자 이하여야 합니다.",
            HttpStatus.BAD_REQUEST
    ),

    ROUTIE_SPACE_NOT_EXISTS(
            "8010",
            "존재하지 않는 루티 스페이스입니다.",
            HttpStatus.NOT_FOUND
    ),
    
    // Routie Domain Validation Errors
    ROUTIE_PLACE_ALREADY_REGISTERED(
            "9001",
            "이미 등록된 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ENTITY_NULL(
            "9002",
            "장소는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_NOT_REGISTERED(
            "9003",
            "루티에 등록되지 않은 장소입니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACE_ORDER_INVALID(
            "9004",
            "루티 장소 순서는 1 이상의 값이어야 합니다.",
            HttpStatus.BAD_REQUEST
    ),
    
    // Route Domain Validation Errors
    ROUTE_ORIGIN_NULL(
            "9010",
            "출발지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_DESTINATION_NULL(
            "9011",
            "도착지는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_MOVING_STRATEGY_NULL(
            "9012",
            "이동 전략은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTES_NULL(
            "9013",
            "Routes 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_NULL(
            "9014",
            "Route 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTE_ROUTIE_PLACE_NULL(
            "9015",
            "RoutiePlace 는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    
    // TimePeriod Domain Validation Errors
    TIME_PERIOD_ROUTIE_PLACE_NULL(
            "9020",
            "RoutiePlace는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_START_TIME_NULL(
            "9021",
            "시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_END_TIME_NULL(
            "9022",
            "종료 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIODS_NULL(
            "9023",
            "TimePeriods는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    TIME_PERIOD_NULL(
            "9024",
            "TimePeriod는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTES_COLLECTION_NULL(
            "9025",
            "루트들은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    ROUTIE_PLACES_COLLECTION_NULL(
            "9026",
            "RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    
    // Validation Domain Errors
    START_TIME_NULL(
            "9030",
            "시작 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    END_TIME_NULL(
            "9031",
            "종료 시간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    DURATION_NULL(
            "9032",
            "기간은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    VALIDATION_STRATEGY_NULL(
            "9040",
            "ValidationStrategy는 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_PLACES_COLLECTION_NULL(
            "9041",
            "유효하지 않은 RoutiePlace 목록은 null일 수 없습니다.",
            HttpStatus.BAD_REQUEST
    ),
    
    // Routie Business Logic Errors
    PLACE_NOT_FOUND_IN_ROUTIE_SPACE(
            "9050",
            "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    PLACE_NOT_FOUND_BY_ID(
            "9051",
            "해당하는 id의 장소를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    ),
    ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER(
            "9052",
            "해당하는 식별자의 루티 스페이스를 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND
    );

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
