package routie.routiespace.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;
import routie.place.controller.dto.request.PlaceCreateRequest;
import routie.place.controller.dto.response.PlaceCreateResponse;

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

        routieSpaceIdentifier = createSpaceResponse.jsonPath().getString("routieSpaceIdentifier");
    }

    @Test
    @DisplayName("루티 스페이스를 생성한다")
    public void createRoutieSpace() {
        // given
        Pattern routieSpaceIdentifierPattern = Pattern.compile(
                "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

        // when
        Response response = RestAssured
                .when()
                .post("/routie-spaces")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        String routieSpaceIdentifier = response.jsonPath().getString("routieSpaceIdentifier");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(routieSpaceIdentifierPattern.matcher(routieSpaceIdentifier).matches()).isTrue();
    }

    @Test
    @DisplayName("장소 생성에 성공한다")
    public void createPlace() {
        // given
        PlaceCreateRequest placeCreateRequest = new PlaceCreateRequest(
                "12345678",
                "스타벅스 강남점",
                "서울시 강남구 테헤란로 123",
                37.504497373023206,
                127.04896282498558,
                60,
                LocalTime.of(9, 0),
                LocalTime.of(22, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0),
                List.of(DayOfWeek.SUNDAY)
        );

        // when
        PlaceCreateResponse placeCreateResponse = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier)
                .then()
                .log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(PlaceCreateResponse.class);

        // then
        Long placeId = placeCreateResponse.id();
        assertThat(placeId).isNotNull();
        assertThat(placeId).isPositive();
    }

    @Test
    @DisplayName("장소 목록 조회에 성공한다")
    public void readPlaces() {
        // given
        PlaceCreateRequest place1RequestBody = new PlaceCreateRequest(
                "12345678",
                "스타벅스 강남점",
                "서울시 강남구 테헤란로 123",
                37.504497373023206,
                127.04896282498558,
                60,
                LocalTime.of(9, 0),
                LocalTime.of(22, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0),
                List.of(DayOfWeek.SUNDAY)
        );

        PlaceCreateRequest place2RequestBody = new PlaceCreateRequest(
                "12345679",
                "투썸플레이스 역삼점",
                "서울시 강남구 역삼동 789",
                37.504497373023206,
                127.04896282498558,
                90,
                LocalTime.of(8, 0),
                LocalTime.of(23, 0),
                null,
                null,
                List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY)
        );

        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(place1RequestBody)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier);
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(place2RequestBody)
                .when()
                .post("/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier);

        // when
        Response response = RestAssured
                .when()
                .get("/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        List<Object> places = response.jsonPath().getList("places");
        String firstPlaceName = response.jsonPath().getString("places[0].name");
        String firstPlaceAddress = response.jsonPath().getString("places[0].roadAddress");
        String firstPlaceOpenAt = response.jsonPath().getString("places[0].openAt");
        String firstPlaceCloseAt = response.jsonPath().getString("places[0].closeAt");
        List<String> firstPlaceClosedDays = response.jsonPath().getList("places[0].closedDayOfWeeks");

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
