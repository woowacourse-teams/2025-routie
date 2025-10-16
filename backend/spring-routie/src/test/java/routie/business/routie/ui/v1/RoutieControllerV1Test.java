package routie.business.routie.ui.v1;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import java.time.LocalDateTime;
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
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.routie.domain.Routie;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.TestRouteApiConfig;
import routie.business.routie.ui.dto.response.RoutieReadResponse;
import routie.business.routie.ui.dto.response.RoutieReadResponse.RouteResponse;
import routie.business.routie.ui.dto.response.RoutieReadResponse.RoutiePlaceResponse;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceBuilder;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@Import(TestRouteApiConfig.class)
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class RoutieControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private UserRepository userRepository;

    private Routie routie;

    private RoutieSpace routieSpace;

    private RoutieSpace routieSpaceWithOneRoutiePlace;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        final User user = UserFixture.emptyUser();
        routieSpace = new RoutieSpaceBuilder()
                .owner(user)
                .build();
        routieSpaceWithOneRoutiePlace = new RoutieSpaceBuilder()
                .owner(user)
                .build();

        final Place placeA = new PlaceBuilder()
                .name("장소 A")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(126.9765)
                .latitude(37.5710)
                .routieSpace(routieSpace)
                .build();

        final Place placeB = new PlaceBuilder()
                .name("장소 B")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0276)
                .latitude(37.4979)
                .routieSpace(routieSpace)
                .build();

        final Place placeC = new PlaceBuilder()
                .name("장소 C")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(126.9765)
                .latitude(37.5710)
                .routieSpace(routieSpaceWithOneRoutiePlace)
                .build();

        routieSpace.getPlaces().add(placeA);
        routieSpace.getPlaces().add(placeB);
        routieSpace.getRoutie().createLastRoutiePlace(placeA);
        routieSpace.getRoutie().createLastRoutiePlace(placeB);

        routieSpaceWithOneRoutiePlace.getPlaces().add(placeC);
        routieSpaceWithOneRoutiePlace.getRoutie().createLastRoutiePlace(placeC);

        userRepository.save(user);
        routieSpaceRepository.save(routieSpace);
        routieSpaceRepository.save(routieSpaceWithOneRoutiePlace);

        routie = routieSpace.getRoutie();
    }

    @Test
    @DisplayName("V1 API로 루티에 장소를 추가할 수 있다")
    void addRoutiePlace() {
        // given
        final Place place = new PlaceBuilder()
                .name("장소 A")
                .roadAddressName("도로명 주소")
                .addressName("지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .routieSpace(routieSpace)
                .build();
        placeRepository.save(place);

        final Map<String, Object> requestBody = Map.of(
                "placeId", place.getId()
        );

        // when
        final Response response = RestAssured
                .given().log().all()
                .when()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/places")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getInt("sequence")).isEqualTo(3);
        assertThat(response.jsonPath().getLong("placeId")).isEqualTo(place.getId());
    }

    @Test
    @DisplayName("V1 API로 새로운 장소만으로 루티를 완전히 교체할 수 있다")
    void updateRoutie_WithNewPlaces_ReplacesEntireRoutie() {
        // given
        final Place newPlace = new PlaceBuilder()
                .name("새로운 장소")
                .roadAddressName("새로운 도로명 주소")
                .addressName("새로운 지번 주소")
                .longitude(127.1)
                .latitude(37.6)
                .routieSpace(routieSpace)
                .build();
        placeRepository.save(newPlace);

        final Map<String, Object> requestBody = Map.of(
                "routiePlaces", List.of(
                        Map.of("placeId", newPlace.getId(), "sequence", 1)
                )
        );

        // when
        final Response response = RestAssured
                .given().log().all()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .patch("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.NO_CONTENT.value());

        final RoutieReadResponse routieReadResponse = RestAssured
                .given()
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
        assertThat(routieReadResponse.routiePlaces().getFirst().placeId()).isEqualTo(newPlace.getId());
        assertThat(routieReadResponse.routiePlaces().getFirst().sequence()).isEqualTo(1);
    }

    @Test
    @DisplayName("V1 API로 유효한 경로 검증 시 200 OK와 함께 isValid true를 반환한다")
    void validateRoutie_WithValidCase_ReturnsOkWithTrue() {
        // given: 검증 조건에 어긋나지 않는 출발, 도착 시각
        final LocalDateTime startTime = LocalDateTime.of(2025, 8, 18, 9, 0);
        final LocalDateTime endTime = LocalDateTime.of(2025, 8, 18, 18, 0);

        // when
        final Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .queryParam("movingStrategy", "DRIVING")
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        final List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        final boolean isAllValid = validationResults.stream()
                .anyMatch(result -> Boolean.TRUE.equals(result.get("isValid")));

        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(isAllValid).isTrue();
    }

    @Test
    @Disabled("검증 기능 제거에 따른 비활성화")
    @DisplayName("V1 API로 장소 휴무일에 방문하는 경로 검증 시 200 OK와 함께 isValid false를 반환한다")
    void validateRoutie_OnClosedDay_ReturnsOkWithFalse() {
        // given: 월요일(장소 B의 휴무일)에 방문
        final LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0);
        final LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        // when
        final Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .queryParam("movingStrategy", MovingStrategy.DRIVING)
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        final List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        final boolean closedDayIsInvalid = validationResults.stream()
                .anyMatch(result -> "IS_NOT_CLOSED_DAY".equals(result.get("validationCode")) &&
                        Boolean.FALSE.equals(result.get("isValid"))
                );

        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(closedDayIsInvalid).isTrue();
    }

    @Test
    @Disabled("검증 기능 제거에 따른 비활성화")
    @DisplayName("V1 API로 브레이크 타임에 겹치는 경로 검증 시 200 OK와 함께 isValid false를 반환한다")
    void validateRoutie_DuringBreakTime_ReturnsOkWithFalse() {
        // given
        // 예상 TimePeriod: A(12:10-13:10), B(14:50-16:20)는 장소 B 브레이크 타임(14:00-15:00)과 겹치므로 isValid = false
        final LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        final LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        // when
        final Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("movingStrategy", "DRIVING")
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        final List<Map<String, Object>> validationResults = response.jsonPath().getList("validationResultResponses");

        final boolean breakTimeIsInvalid = validationResults.stream()
                .anyMatch(result -> "IS_NOT_DURING_BREAKTIME".equals(result.get("validationCode")) &&
                        Boolean.FALSE.equals(result.get("isValid"))
                );

        assertThat(breakTimeIsInvalid).isTrue();
    }

    @Test
    @DisplayName("V1 API로 잘못된 형식의 시간 파라미터로 요청 시 400 Bad Request를 반환한다")
    void validateRoutie_WithInvalidTimeFormat_ReturnsBadRequestError() {
        // given
        // invalidStartTime이 ISO_DATE_TIME 형식이 아님
        final String invalidStartTime = "2025-07-29 10:00:00";
        final String validEndTime = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);

        // when
        final Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", invalidStartTime)
                .queryParam("endDateTime", validEndTime)
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validation")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @Disabled("검증 기능 제거에 따른 비활성화")
    @DisplayName("V1 API로 startDateTime이 쿼리 파라미터로 온 요청에 대해서는 루티 플레이스의 도착, 출발 정보 정상 반환")
    void readRoutieWithStartDateTime() {
        // given
        final String startDateTime = "2025-07-29T10:00:00";

        // when
        final RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startDateTime)
                .queryParam("movingStrategy", "DRIVING")
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        final RoutiePlaceResponse firstRoutiePlace = routieReadResponse.routiePlaces().get(0);
        final RoutiePlaceResponse secondRoutiePlace = routieReadResponse.routiePlaces().get(1);
        final RouteResponse route = routieReadResponse.routes().get(0);

        assertThat(routieReadResponse.routiePlaces()).hasSize(2);
        assertThat(routieReadResponse.routes()).hasSize(1);

        assertThat(firstRoutiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 10, 0));
        assertThat(firstRoutiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 11, 0));
        assertThat(firstRoutiePlace.sequence()).isEqualTo(1);

        assertThat(secondRoutiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 11, 1));
        assertThat(secondRoutiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 12, 31));
        assertThat(secondRoutiePlace.sequence()).isEqualTo(2);

        assertThat(route.fromSequence()).isEqualTo(1);
        assertThat(route.toSequence()).isEqualTo(2);
        assertThat(route.duration()).isEqualTo(1);
        assertThat(route.distance()).isEqualTo(1000);
    }

    @Test
    @Disabled("검증 기능 제거에 따른 비활성화")
    @DisplayName("V1 API로 RoutiePlace가 하나만 있을 때도 정상적으로 도착/출발 정보 반환")
    void readRoutieWithSingleRoutiePlace() {
        // given
        final String startDateTime = "2025-07-29T10:00:00";

        // when
        final RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startDateTime)
                .queryParam("movingStrategy", "DRIVING")
                .when()
                .get("/v1/routie-spaces/" + routieSpaceWithOneRoutiePlace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
        assertThat(routieReadResponse.routes()).isEmpty();

        final RoutiePlaceResponse routiePlace = routieReadResponse.routiePlaces().get(0);

        assertThat(routiePlace.sequence()).isEqualTo(1);
        assertThat(routiePlace.arriveDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 10, 0));
        assertThat(routiePlace.departureDateTime()).isEqualTo(LocalDateTime.of(2025, 7, 29, 11, 0));
    }

    @Test
    @DisplayName("V1 API로 startDateTime이 쿼리 파라미터로 오지 않은 요청에 대해서는 루티 플레이스의 도착, 출발 정보 null 명시적 반환")
    void readRoutieWithoutStartDateTime() {
        // given

        // when
        final RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .when()
                .queryParam("movingStrategy", "DRIVING")
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        final RoutiePlaceResponse firstRoutiePlace = routieReadResponse.routiePlaces().get(0);
        final RoutiePlaceResponse secondRoutiePlace = routieReadResponse.routiePlaces().get(1);
        final RouteResponse route = routieReadResponse.routes().get(0);

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
    @DisplayName("V1 API로 movingStrategy 쿼리 파라미터가 없으면, 경로와 시간 정보 응답은 비어있다")
    void readRoutie_whenMovingStrategyIsAbsent() {
        // given & when
        final RoutieReadResponse response = RestAssured
                .given().log().all()
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        // then
        assertThat(response.routiePlaces()).hasSize(2);

        final RoutiePlaceResponse firstRoutiePlace = response.routiePlaces().get(0);
        assertThat(firstRoutiePlace.sequence()).isEqualTo(1);
        assertThat(firstRoutiePlace.arriveDateTime()).isNull();
        assertThat(firstRoutiePlace.departureDateTime()).isNull();

        final RoutiePlaceResponse secondRoutiePlace = response.routiePlaces().get(1);
        assertThat(secondRoutiePlace.sequence()).isEqualTo(2);
        assertThat(secondRoutiePlace.arriveDateTime()).isNull();
        assertThat(secondRoutiePlace.departureDateTime()).isNull();

        assertThat(response.routes()).isEmpty();
    }

    @Test
    @DisplayName("V1 API로 루티의 장소를 삭제할 수 있다")
    void deleteRoutiePlace() {
        // given
        final long placeId = routie.getRoutiePlaces().getFirst().getPlace().getId();

        // when
        final Response response = RestAssured
                .given().log().all()
                .when()
                .delete("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie/places/" + placeId)
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.NO_CONTENT.value());

        // 추가 검증: 루티에서 해당 장소가 삭제되었는지 확인
        final RoutieReadResponse routieReadResponse = RestAssured
                .given().log().all()
                .when()
                .get("/v1/routie-spaces/" + routieSpace.getIdentifier() + "/routie")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieReadResponse.class);

        assertThat(routieReadResponse.routiePlaces()).hasSize(1);
    }
}
