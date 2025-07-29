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
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.repository.RoutieRepository;
import routie.routiespace.domain.RoutieSpaceFixture;
import routie.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.routiespace.repository.RoutieSpaceRepository;

@SpringBootTest(webEnvironment = WebEnvironment.DEFINED_PORT)
class RoutieControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieRepository routieRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    private Routie routie;

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
        routie = Routie.withoutRoutiePlaces();
        routie.modify(new ArrayList<>(List.of(routiePlace1, routiePlace2)));

        routieSpaceRepository.save(RoutieSpaceFixture.createWithoutId(List.of(), List.of(routie)));

        routieRepository.save(routie);
    }

    @Test
    @DisplayName("유효한 경로 검증 시 200 OK와 함께 isValid true를 반환한다")
    void validateRoutie_WithValidCase_ReturnsOkWithTrue() {
        // given
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 9, 0); // 화요일
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routies/{routieId}/validity", routie.getId())
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getBoolean("isValid")).isTrue();
    }

    @Test
    @DisplayName("장소 휴무일에 방문하는 경로 검증 시 200 OK와 함께 isValid false를 반환한다")
    void validateRoutie_OnClosedDay_ReturnsOkWithFalse() {
        // given
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0); // 월요일 (장소 B 휴무)
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routies/{routieId}/validity", routie.getId())
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
        // 예상 경로: A(12:10-13:10) -> 이동(100분) -> B(14:50-16:20) -> 장소 B 브레이크 타임(14:00-15:00)과 겹침
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", startTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .queryParam("endDateTime", endTime.format(DateTimeFormatter.ISO_DATE_TIME))
                .when()
                .get("/routies/{routieId}/validity", routie.getId())
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
        String invalidStartTime = "2025-07-29 10:00:00"; // ISO_DATE_TIME 형식이 아님
        String validEndTime = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);

        // when
        Response response = RestAssured
                .given().log().all()
                .queryParam("startDateTime", invalidStartTime)
                .queryParam("endDateTime", validEndTime)
                .when()
                .get("/routies/{routieId}/validity", routie.getId())
                .then().log().all()
                .extract().response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
}
