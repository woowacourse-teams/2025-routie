package routie.routiespace.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import java.util.List;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;

@SpringBootTest(webEnvironment = WebEnvironment.DEFINED_PORT)
public class RoutieSpaceControllerTest {

    private String routieSpaceIdentifier;

    @BeforeEach
    void setUp() {
        // 테스트용 루티 스페이스 생성
        Response createSpaceResponse = RestAssured
                .when()
                .post("/routie-spaces")
                .then()
                .extract().response();

        String locationUrl = createSpaceResponse.getHeader("Location");
        routieSpaceIdentifier = locationUrl.substring("/routie-spaces/".length());
    }

    @Test
    @DisplayName("루티 스페이스를 생성한다")
    public void createRoutieSpace() {
        // given
        Pattern locationUrlPattern = Pattern.compile(
                "/routie-spaces/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

        // when
        Response response = RestAssured
                .when()
                .post("/routie-spaces")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.CREATED;

        String locationUrl = response.getHeader("Location");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(locationUrlPattern.matcher(locationUrl).matches()).isTrue();
    }

    @Test
    @DisplayName("장소 생성에 성공한다")
    public void createPlace() {
        // given
        String requestBody = """
                {
                    "name": "스타벅스 강남점",
                    "address": "서울시 강남구 테헤란로 123",
                    "stayDurationMinutes": 60,
                    "openAt": "09:00",
                    "closeAt": "22:00",
                    "breakStartAt": "15:00",
                    "breakEndAt": "16:00",
                    "closedDays": ["SUNDAY"]
                }
                """;

        // when
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/place", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        Long placeId = response.jsonPath().getLong("id");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(placeId).isNotNull();
        assertThat(placeId).isPositive();
    }

    @Test
    @DisplayName("장소 목록 조회에 성공한다")
    public void readPlaces() {
        // given
        String place1RequestBody = """
                {
                    "name": "스타벅스 강남점",
                    "address": "서울시 강남구 테헤란로 123",
                    "stayDurationMinutes": 60,
                    "openAt": "09:00",
                    "closeAt": "22:00",
                    "breakStartAt": "15:00",
                    "breakEndAt": "16:00",
                    "closedDays": ["SUNDAY"]
                }
                """;

        String place2RequestBody = """
                {
                    "name": "투썸플레이스 역삼점",
                    "address": "서울시 강남구 역삼동 789",
                    "stayDurationMinutes": 90,
                    "openAt": "08:00",
                    "closeAt": "23:00",
                    "breakStartAt": null,
                    "breakEndAt": null,
                    "closedDays": ["MONDAY", "TUESDAY"]
                }
                """;

        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(place1RequestBody)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/place", routieSpaceIdentifier);
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(place2RequestBody)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/place", routieSpaceIdentifier);

        // when
        Response response = RestAssured
                .when()
                .get("/routie-spaces/{routieSpaceIdentifier}/place", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        List<Object> places = response.jsonPath().getList("places");
        String firstPlaceName = response.jsonPath().getString("places[0].name");
        String firstPlaceAddress = response.jsonPath().getString("places[0].address");
        String firstPlaceOpenAt = response.jsonPath().getString("places[0].openAt");
        String firstPlaceCloseAt = response.jsonPath().getString("places[0].closeAt");
        List<String> firstPlaceClosedDays = response.jsonPath().getList("places[0].closedDays");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(places).hasSize(2);
        assertThat(firstPlaceName).isIn("스타벅스 강남점", "투썸플레이스 역삼점");
        assertThat(firstPlaceAddress).isNotNull();
        assertThat(firstPlaceOpenAt).isNotNull();
        assertThat(firstPlaceCloseAt).isNotNull();
        assertThat(firstPlaceClosedDays).isNotNull();
    }
}
