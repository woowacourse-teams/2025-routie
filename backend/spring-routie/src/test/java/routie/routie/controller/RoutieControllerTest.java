package routie.routie.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import routie.place.domain.Place;
import routie.place.domain.PlaceBuilder;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieReadResponse.RouteResponse;
import routie.routie.controller.dto.response.RoutieReadResponse.RoutiePlaceResponse;
import routie.routie.domain.Routie;
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.TestRouteApiConfig;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceFixture;
import routie.routiespace.repository.RoutieSpaceRepository;

@Import(TestRouteApiConfig.class)
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class RoutieControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private PlaceRepository placeRepository;

    private Routie routie;

    private RoutieSpace routieSpace;

    private RoutieSpace routieSpaceWithOneRoutiePlace;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        routieSpace = RoutieSpaceFixture.createEmpty();
        routieSpaceWithOneRoutiePlace = RoutieSpaceFixture.createEmpty();

        Place placeA = new PlaceBuilder()
                .name("장소 A")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(60)
                .openAt(LocalTime.of(9, 0))
                .closeAt(LocalTime.of(18, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(routieSpace)
                .placeClosedDayOfWeeks(List.of())
                .build();

        Place placeB = new PlaceBuilder()
                .name("장소 B")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(90)
                .openAt(LocalTime.of(10, 0))
                .closeAt(LocalTime.of(20, 0))
                .breakStartAt(LocalTime.of(14, 0))
                .breakEndAt(LocalTime.of(15, 0))
                .routieSpace(routieSpace)
                .placeClosedDayOfWeeksByDayOfWeeks(List.of(DayOfWeek.MONDAY))
                .build();

        Place placeC = new PlaceBuilder()
                .name("장소 C")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(60)
                .openAt(LocalTime.of(9, 0))
                .closeAt(LocalTime.of(18, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(routieSpaceWithOneRoutiePlace)
                .placeClosedDayOfWeeks(List.of())
                .build();

        routieSpace.getPlaces().add(placeA);
        routieSpace.getPlaces().add(placeB);
        routieSpace.getRoutie().createLastRoutiePlace(placeA);
        routieSpace.getRoutie().createLastRoutiePlace(placeB);

        routieSpaceWithOneRoutiePlace.getPlaces().add(placeC);
        routieSpaceWithOneRoutiePlace.getRoutie().createLastRoutiePlace(placeC);

        routieSpaceRepository.save(routieSpace);
        routieSpaceRepository.save(routieSpaceWithOneRoutiePlace);

        routie = routieSpace.getRoutie();
    }

    @Test
    @DisplayName("루티에 장소를 추가할 수 있다")
    void addRoutiePlace() {
        // given
        Place place = new PlaceBuilder()
                .name("장소 A")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(60)
                .openAt(LocalTime.of(9, 0))
                .closeAt(LocalTime.of(18, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(routieSpace)
                .placeClosedDayOfWeeks(List.of())
                .build();
        placeRepository.save(place);

        Map<String, Object> requestBody = Map.of(
                "placeId", place.getId()
        );

        // when
        Response response = RestAssured
                .given().log().all()
                .when()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/places")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getInt("sequence")).isEqualTo(3);
        assertThat(response.jsonPath().getLong("placeId")).isEqualTo(place.getId());
    }

    @Test
    @DisplayName("새로운 장소만으로 루티를 완전히 교체할 수 있다")
    void updateRoutie_WithNewPlaces_ReplacesEntireRoutie() {
        // given
        Place newPlace = new PlaceBuilder()
                .name("새로운 장소")
                .roadAddressName("새로운 도로명 주소")
                .addressName("새로운 지번 주소")
                .longitude(127.1)
                .latitude(37.6)
                .stayDurationMinutes(120)
                .openAt(LocalTime.of(8, 0))
                .closeAt(LocalTime.of(22, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(routieSpace)
                .placeClosedDayOfWeeks(List.of())
                .build();
        placeRepository.save(newPlace);

        Map<String, Object> requestBody = Map.of(
                "routiePlaces", List.of(
                        Map.of("placeId", newPlace.getId(), "sequence", 1)
                )
        );

        // when
        Response response = RestAssured
                .given().log().all()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .patch("/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.NO_CONTENT.value());

        RoutieReadResponse routieReadResponse = RestAssured
                .given()
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
        assertThat(routieReadResponse.routiePlaces().getFirst().placeId()).isEqualTo(newPlace.getId());
        assertThat(routieReadResponse.routiePlaces().getFirst().sequence()).isEqualTo(1);
    }

    @Test
    @DisplayName("유효한 경로 검증 시 200 OK와 함께 isValid true를 반환한다")
    void validateRoutie_WithValidCase_ReturnsOkWithTrue() {
        // given: 검증 조건에 어긋나지 않는 출발, 도착 시각
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 9, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        boolean isAllValid = validationResults.stream()
                .anyMatch(result -> Boolean.TRUE.equals(result.get("isValid")));

        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(isAllValid).isTrue();
    }

    @Test
    @DisplayName("장소 휴무일에 방문하는 경로 검증 시 200 OK와 함께 isValid false를 반환한다")
    void validateRoutie_OnClosedDay_ReturnsOkWithFalse() {
        // given: 월요일(장소 B의 휴무일)에 방문
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        boolean closedDayIsInvalid = validationResults.stream()
                .anyMatch(result ->
                        "IS_NOT_CLOSED_DAY".equals(result.get("validationCode")) &&
                                Boolean.FALSE.equals(result.get("isValid"))
                );

        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(closedDayIsInvalid).isTrue();
    }

    @Test
    @DisplayName("브레이크 타임에 겹치는 경로 검증 시 200 OK와 함께 isValid false를 반환한다")
    void validateRoutie_DuringBreakTime_ReturnsOkWithFalse() {
        // given
        // 예상 TimePeriod: A(12:10-13:10), B(14:50-16:20)는 장소 B 브레이크 타임(14:00-15:00)과 겹치므로 isValid = false
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        boolean breakTimeIsInvalid = validationResults.stream()
                .anyMatch(result ->
                        "IS_NOT_DURING_BREAKTIME".equals(result.get("validationCode")) &&
                                Boolean.FALSE.equals(result.get("isValid"))
                );

        assertThat(breakTimeIsInvalid).isTrue();
    }

    @Test
    @DisplayName("잘못된 형식의 시간 파라미터로 요청 시 500 Internal Server Error를 반환한다")
    void validateRoutie_WithInvalidTimeFormat_ReturnsBadRequest() {
        // given
        // invalidStartTime이 ISO_DATE_TIME 형식이 아님
        String invalidStartTime = "2025-07-29 10:00:00";
        String validEndTime = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", invalidStartTime)
                .queryParam("endDateTime", validEndTime)
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validity")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    @Disabled
    @Test
    @DisplayName("startDateTime이 쿼리 파라미터로 온 요청에 대해서는 루티 플레이스의 도착, 출발 정보 정상 반환")
    void readRoutieWithStartDateTime() {
        // given
        String startDateTime = "2025-07-29T10:00:00";

        // when
        RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startDateTime)
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        RoutiePlaceResponse firstRoutiePlace = routieReadResponse.routiePlaces().get(0);
        RoutiePlaceResponse secondRoutiePlace = routieReadResponse.routiePlaces().get(1);
        RouteResponse route = routieReadResponse.routes().get(0);

        assertThat(routieReadResponse.routiePlaces()).hasSize(2);
        assertThat(routieReadResponse.routes()).hasSize(1);

        assertThat(firstRoutiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 10, 0));
        assertThat(firstRoutiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 11, 0));
        assertThat(firstRoutiePlace.sequence()).isEqualTo(1);

        assertThat(secondRoutiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 12, 40));
        assertThat(secondRoutiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 14, 10));
        assertThat(secondRoutiePlace.sequence()).isEqualTo(2);

        assertThat(route.fromSequence()).isEqualTo(1);
        assertThat(route.toSequence()).isEqualTo(2);
        assertThat(route.duration()).isEqualTo(100);
        assertThat(route.distance()).isEqualTo(1000);
    }

    @Test
    @DisplayName("RoutiePlace가 하나만 있을 때도 정상적으로 도착/출발 정보 반환")
    void readRoutieWithSingleRoutiePlace() {
        // given
        String startDateTime = "2025-07-29T10:00:00";

        // when
        RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startDateTime)
                .when()
                .get("/routie-spaces/" + routieSpaceWithOneRoutiePlace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
        assertThat(routieReadResponse.routes()).isEmpty();

        RoutiePlaceResponse routiePlace = routieReadResponse.routiePlaces().get(0);

        assertThat(routiePlace.sequence()).isEqualTo(1);
        assertThat(routiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 10, 0));
        assertThat(routiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 11, 0));
    }

    @Test
    @DisplayName("startDateTime이 쿼리 파라미터로 오지 않은 요청에 대해서는 루티 플레이스의 도착, 출발 정보 null 명시적 반환")
    void readRoutieWithoutStartDateTime() {
        // given

        // when
        RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        RoutiePlaceResponse firstRoutiePlace = routieReadResponse.routiePlaces().get(0);
        RoutiePlaceResponse secondRoutiePlace = routieReadResponse.routiePlaces().get(1);
        RouteResponse route = routieReadResponse.routes().get(0);

        assertThat(routieReadResponse.routiePlaces()).hasSize(2);
        assertThat(routieReadResponse.routes()).hasSize(1);

        assertThat(firstRoutiePlace.arriveDateTime()).isNull();
        assertThat(firstRoutiePlace.departureDateTime()).isNull();
        assertThat(firstRoutiePlace.sequence()).isEqualTo(1);

        assertThat(secondRoutiePlace.arriveDateTime()).isNull();
        assertThat(secondRoutiePlace.departureDateTime()).isNull();
        assertThat(secondRoutiePlace.sequence()).isEqualTo(2);

        assertThat(route.fromSequence()).isEqualTo(1);
        assertThat(route.toSequence()).isEqualTo(2);
        assertThat(route.duration()).isEqualTo(1);
        assertThat(route.distance()).isEqualTo(1000);
    }

    @Test
    @DisplayName("루티의 장소를 삭제할 수 있다")
    void deleteRoutiePlace() {
        // given
        long placeId = routie.getRoutiePlaces().getFirst().getPlace().getId();

        // when
        Response response = RestAssured
                .given().log().all()
                .when()
                .delete("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/places/" + placeId)
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.NO_CONTENT.value());

        // 추가 검증: 루티에서 해당 장소가 삭제되었는지 확인
        RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .when()
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
    }
}
