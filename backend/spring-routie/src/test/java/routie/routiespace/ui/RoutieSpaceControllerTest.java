package routie.routiespace.ui;

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
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import routie.place.ui.dto.request.PlaceCreateRequest;
import routie.place.ui.dto.response.PlaceCreateResponse;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class RoutieSpaceControllerTest {

    @LocalServerPort
    private int port;

    private String routieSpaceIdentifier;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

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
                "서울시 강남구 도로명 주소",
                "서울시 강남구 지번 주소",
                127.04896282498558,
                37.504497373023206
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
                "서울시 강남구 도로명 주소",
                "서울시 강남구 지번 주소",
                127.04896282498558,
                37.504497373023206
        );

        PlaceCreateRequest place2RequestBody = new PlaceCreateRequest(
                "12345679",
                "투썸플레이스 역삼점",
                "서울시 강남구 도로명 주소",
                "서울시 강남구 지번 주소",
                127.04896282498558,
                37.504497373023206
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
        String firstPlaceAddress = response.jsonPath().getString("places[0].roadAddressName");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(places).hasSize(2);
        assertThat(firstPlaceName).isIn("스타벅스 강남점", "투썸플레이스 역삼점");
        assertThat(firstPlaceAddress).isNotNull();
    }
}
