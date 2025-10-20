package routie.business.routiespace.ui.v1;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

import java.util.List;
import java.util.regex.Pattern;

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
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.place.domain.PlaceFixture;
import routie.business.place.ui.dto.request.PlaceCreateRequest;
import routie.business.place.ui.dto.request.PlaceCreateRequestV2;
import routie.business.place.ui.dto.response.PlaceCreateResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceListResponse;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class RoutieSpaceControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProcessor jwtProcessor;

    private String routieSpaceIdentifier;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        // 테스트용 루티 스페이스 생성
        final Response createSpaceResponse = RestAssured
                .when()
                .post("/v1/routie-spaces")
                .then()
                .extract().response();

        routieSpaceIdentifier = createSpaceResponse.jsonPath().getString("routieSpaceIdentifier");
    }

    @Test
    @DisplayName("V1 API로 루티 스페이스를 생성한다")
    public void createRoutieSpace() {
        // given
        final Pattern routieSpaceIdentifierPattern = Pattern.compile(
                "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

        // when
        final Response response = RestAssured
                .when()
                .post("/v1/routie-spaces")
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final String routieSpaceIdentifier = response.jsonPath().getString("routieSpaceIdentifier");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(routieSpaceIdentifierPattern.matcher(routieSpaceIdentifier).matches()).isTrue();
    }

    @Test
    @DisplayName("V1 API로 장소 생성에 성공한다")
    public void createPlace() {
        // given
        final PlaceCreateRequest placeCreateRequest = new PlaceCreateRequest(
                "12345678",
                "스타벅스 강남점",
                "서울시 강남구 도로명 주소",
                "서울시 강남구 지번 주소",
                127.04896282498558,
                37.504497373023206
        );

        // when
        final PlaceCreateResponse placeCreateResponse = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v1/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier)
                .then()
                .log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(PlaceCreateResponse.class);

        // then
        final Long placeId = placeCreateResponse.id();
        assertThat(placeId).isNotNull();
        assertThat(placeId).isPositive();
    }

    @Test
    @DisplayName("V1 API로 장소 목록 조회에 성공한다")
    public void readPlaces() {
        // given
        final PlaceCreateRequest place1RequestBody = new PlaceCreateRequest(
                "12345678",
                "스타벅스 강남점",
                "서울시 강남구 도로명 주소",
                "서울시 강남구 지번 주소",
                127.04896282498558,
                37.504497373023206
        );

        final PlaceCreateRequest place2RequestBody = new PlaceCreateRequest(
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
                .post("/v1/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier);
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(place2RequestBody)
                .when()
                .post("/v1/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier);

        // when
        final Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}/places", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final List<Object> places = response.jsonPath().getList("places");
        final String firstPlaceName = response.jsonPath().getString("places[0].name");
        final String firstPlaceAddress = response.jsonPath().getString("places[0].roadAddressName");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(places).hasSize(2);
        assertThat(firstPlaceName).isIn("스타벅스 강남점", "투썸플레이스 역삼점");
        assertThat(firstPlaceAddress).isNotNull();
    }

    @Test
    @DisplayName("V1 API로 내 루티 스페이스 목록 조회에 성공한다")
    public void readMyRoutieSpaces() {
        // 테스트용 사용자 생성 및 토큰 발급
        final User user = UserFixture.emptyUser();
        userRepository.save(user);
        final String accessToken = jwtProcessor.createJwt(user);

        // given
        RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .post("/v2/routie-spaces")
                .then().log().all()
                .statusCode(HttpStatus.OK.value());

        RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .post("/v2/routie-spaces")
                .then().log().all()
                .statusCode(HttpStatus.OK.value());

        // when
        final RoutieSpaceListResponse routieSpaceListResponse = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .get("/v1/my-routie-spaces")
                .then().log().all()
                .log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(RoutieSpaceListResponse.class);

        // then
        assertThat(routieSpaceListResponse.routieSpaces()).hasSize(2);
    }

    @Test
    @DisplayName("V1 API로 루티 스페이스 삭제에 성공한다")
    public void deleteRoutieSpace() {
        // 테스트용 사용자 생성 및 토큰 발급
        final User user = UserFixture.emptyUser();
        userRepository.save(user);
        final String accessToken = jwtProcessor.createJwt(user);

        // given
        final Response createSpaceResponse = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .post("/v2/routie-spaces")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract().response();

        final String newRoutieSpaceIdentifier = createSpaceResponse.jsonPath().getString("routieSpaceIdentifier");

        final PlaceCreateRequest placeCreateRequest = new PlaceCreateRequest(
                "testPlaceId",
                PlaceFixture.anyName(),
                PlaceFixture.anyRoadAddressName(),
                PlaceFixture.anyAddressName(),
                PlaceFixture.anyLongitude(),
                PlaceFixture.anyLatitude()
        );
        final PlaceCreateResponse placeCreateResponse = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v1/routie-spaces/{routieSpaceIdentifier}/places", newRoutieSpaceIdentifier)
                .then().log().all()
                .log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(PlaceCreateResponse.class);
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .when()
                .post(
                        "/v1/routie-spaces/{routieSpaceIdentifier}/places/{placeId}/likes",
                        newRoutieSpaceIdentifier,
                        placeCreateResponse.id()
                );

        // when
        RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .delete("/v1/routie-spaces/{routieSpaceIdentifier}", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.NO_CONTENT.value());

        // then
        // 삭제된 루티 스페이스 조회 시 404 응답 확인
        RestAssured
                .given().log().all()
                .when().log().all()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("V1 API로 해시태그가 있는 장소를 포함한 루티 스페이스 삭제에 성공한다")
    public void deleteRoutieSpaceWithHashtags() {
        // 테스트용 사용자 생성 및 토큰 발급
        final User user = UserFixture.emptyUser();
        userRepository.save(user);
        final String accessToken = jwtProcessor.createJwt(user);

        // given
        final Response createSpaceResponse = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .post("/v2/routie-spaces")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract().response();

        final String newRoutieSpaceIdentifier = createSpaceResponse.jsonPath().getString("routieSpaceIdentifier");

        // 해시태그를 포함한 장소 생성 (V2 API 사용)
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "testPlaceId",
                "스타벅스 강남점",
                "서울시 강남구 테헤란로 123",
                "서울시 강남구 역삼동 123-45",
                127.0276,
                37.4979,
                List.of("카페", "조용함")
        );

        final PlaceCreateRequestV2 placeCreateRequest2 = new PlaceCreateRequestV2(
                "testPlaceId2",
                "스타벅스 강남점",
                "서울시 강남구 테헤란로 123",
                "서울시 강남구 역삼동 123-45",
                127.0276,
                37.4979,
                List.of("술집", "조용함")
        );

        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.OK.value());
        RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest2)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.OK.value());

        // when - 루티 스페이스 삭제
        RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().log().all()
                .delete("/v1/routie-spaces/{routieSpaceIdentifier}", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.NO_CONTENT.value());

        // then - 삭제된 루티 스페이스 조회 시 404 응답 확인
        RestAssured
                .given().log().all()
                .when().log().all()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}", newRoutieSpaceIdentifier)
                .then().log().all()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
