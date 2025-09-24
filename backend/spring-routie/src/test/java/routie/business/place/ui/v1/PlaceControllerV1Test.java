package routie.business.place.ui.v1;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
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
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class PlaceControllerV1Test {

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

        testRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        testPlace = new PlaceBuilder()
                .name("테스트 카페")
                .roadAddressName("서울시 강남구 테스트로 123")
                .longitude(10.123)
                .latitude(10.123)
                .routieSpace(testRoutieSpace)
                .build();
        placeRepository.save(testPlace);
    }

    @Test
    @DisplayName("V1 API로 장소를 삭제한다")
    public void deletePlace() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .delete("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NO_CONTENT;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V1 API로 루티 장소에서 사용 중인 장소는 삭제할 수 없다")
    public void cannotDeletePlaceWhenUsedInRoutiePlace() {
        // given
        long placeId = testPlace.getId();
        testRoutieSpace.getRoutie().createLastRoutiePlace(testPlace);
        routieSpaceRepository.save(testRoutieSpace);

        // when
        Response response = RestAssured
                .when()
                .delete("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.BAD_REQUEST;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V1 API로 존재하지 않는 장소 삭제 시 예외가 발생한다")
    public void deleteNonExistentPlace() {
        // given
        long nonExistentPlaceId = 999999L;

        // when
        Response response = RestAssured
                .when()
                .delete("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + nonExistentPlaceId)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V1 API로 장소를 조회한다")
    public void readPlace() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
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
        assertThat(responseBody).contains("roadAddressName");
        assertThat(responseBody).contains("longitude");
        assertThat(responseBody).contains("latitude");
    }

    @Test
    @DisplayName("V1 API로 장소를 조회한다 - 응답 구조 검증")
    public void readPlaceWithDetailValidation() {
        // given
        long placeId = testPlace.getId();

        // when
        Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId)
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
                "roadAddressName",
                "longitude",
                "latitude"
        );
    }
}
