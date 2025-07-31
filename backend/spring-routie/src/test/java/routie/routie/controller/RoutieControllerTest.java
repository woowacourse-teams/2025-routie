package routie.routie.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieReadResponse.RouteResponse;
import routie.routie.controller.dto.response.RoutieReadResponse.RoutiePlaceResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceFixture;
import routie.routiespace.repository.RoutieSpaceRepository;

@SpringBootTest(webEnvironment = WebEnvironment.DEFINED_PORT)
class RoutieControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    private Routie routie;

    private RoutieSpace routieSpace;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        Place placeA = Place.create(
                "장소 A",
                "주소 A",
                60,
                LocalTime.of(9, 0),
                LocalTime.of(18, 0),
                null,
                null,
                null,
                List.of()
        );

        Place placeB = Place.create(
                "장소 B",
                "주소 B",
                90,
                LocalTime.of(10, 0),
                LocalTime.of(20, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                null,
                List.of(DayOfWeek.MONDAY)
        );

        placeRepository.saveAll(List.of(placeA, placeB));

        RoutiePlace routiePlace1 = new RoutiePlace(1, placeA);
        RoutiePlace routiePlace2 = new RoutiePlace(2, placeB);
        routie = Routie.create(new ArrayList<>(List.of(routiePlace1, routiePlace2)));

        routieSpace = RoutieSpaceFixture.createWithoutId(List.of(), routie);
        routieSpaceRepository.save(routieSpace);
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
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validity")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getBoolean("isValid")).isTrue();
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
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validity")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getBoolean("isValid")).isFalse();
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
                .get("/routie-spaces/" + routieSpace.getIdentifier() + "/routie/validity")
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getBoolean("isValid")).isFalse();
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
        assertThat(route.duration()).isEqualTo(100);
        assertThat(route.distance()).isEqualTo(1000);
    }
}
