package routie.place.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.routiespace.repository.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class PlaceControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    private Place testPlace;
    private RoutieSpace testRoutieSpace;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        testRoutieSpace = routieSpaceRepository.save(RoutieSpace.from(routieSpaceIdentifierProvider));

        testPlace = placeRepository.save(
                Place.create(
                        "테스트 카페",
                        "서울시 강남구 테스트로 123",
                        60,
                        LocalTime.of(9, 0),
                        LocalTime.of(22, 0),
                        LocalTime.of(14, 0),
                        LocalTime.of(15, 0),
                        testRoutieSpace,
                        new ArrayList<>()
                )
        );
    }

    @Test
    @DisplayName("장소를 수정한다")
    public void updatePlace() {
        // given
        long placeId = testPlace.getId();
        Map<String, Object> updateRequest = Map.of(
                "stayDurationMinutes", 120,
                "openAt", "09:00",
                "closeAt", "18:00",
                "breakStartAt", "12:00",
                "breakEndAt", "13:00",
                "closedDayOfWeeks", List.of("SUNDAY", "MONDAY")
        );

        // when
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
                .when()
                .patch("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("장소를 수정한다 - 브레이크 타임 없음")
    public void updatePlaceWithoutBreakTime() {
        // given
        long placeId = testPlace.getId();
        Map<String, Object> updateRequest = Map.of(
                "stayDurationMinutes", 90,
                "openAt", "10:00",
                "closeAt", "22:00",
                "closedDayOfWeeks", List.of("WEDNESDAY")
        );

        // when
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
                .when()
                .patch("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("장소를 수정한다 - 최소 체류시간")
    public void updatePlaceWithMinimumStayDuration() {
        // given
        long placeId = testPlace.getId();
        Map<String, Object> updateRequest = Map.of(
                "stayDurationMinutes", 0,
                "openAt", "00:00",
                "closeAt", "23:59",
                "closedDayOfWeeks", List.of()
        );

        // when
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
                .when()
                .patch("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("장소를 수정한다 - 최대 체류시간")
    public void updatePlaceWithMaximumStayDuration() {
        // given
        long placeId = testPlace.getId();
        Map<String, Object> updateRequest = Map.of(
                "stayDurationMinutes", 1440,
                "openAt", "08:00",
                "closeAt", "20:00",
                "breakStartAt", "14:00",
                "breakEndAt", "15:00",
                "closedDayOfWeeks", List.of("SATURDAY", "SUNDAY")
        );

        // when
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
                .when()
                .patch("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("장소를 삭제한다")
    public void deletePlace() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .delete("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NO_CONTENT;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("장소를 조회한다")
    public void readPlace() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .get("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        String responseBody = response.getBody().asString();

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(responseBody).isNotNull();
        assertThat(responseBody).contains("name");
        assertThat(responseBody).contains("address");
        assertThat(responseBody).contains("stayDurationMinutes");
    }

    @Test
    @DisplayName("장소를 조회한다 - 응답 구조 검증")
    public void readPlaceWithDetailValidation() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .get("/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        Map<String, Object> responseBody = response.jsonPath().getMap("");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(responseBody).containsKeys(
                "name",
                "address",
                "stayDurationMinutes",
                "openAt",
                "closeAt",
                "breakStartAt",
                "breakEndAt",
                "closedDayOfWeeks"
        );
        assertThat(responseBody.get("stayDurationMinutes")).isInstanceOf(Integer.class);
        assertThat(responseBody.get("closedDayOfWeeks")).isInstanceOf(List.class);
    }
}
