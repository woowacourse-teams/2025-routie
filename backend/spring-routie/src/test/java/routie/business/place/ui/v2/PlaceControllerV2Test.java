package routie.business.place.ui.v2;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
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
import routie.business.place.ui.dto.response.PlaceListResponseV2;
import routie.business.place.ui.dto.response.PlaceListResponseV2.PlaceCardResponseV2;
import routie.business.placelike.domain.PlaceLike;
import routie.business.placelike.domain.PlaceLikeBuilder;
import routie.business.placelike.domain.PlaceLikeRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class PlaceControllerV2Test {

    @LocalServerPort
    private int port;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Autowired
    private PlaceLikeRepository placeLikeRepository;

    private RoutieSpace testRoutieSpace;
    private Place place1;
    private Place place2;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        testRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));

        place1 = new PlaceBuilder()
                .name("인기 카페")
                .roadAddressName("서울시 강남구 인기로 123")
                .longitude(10.123)
                .latitude(10.123)
                .routieSpace(testRoutieSpace)
                .build();
        placeRepository.save(place1);

        place2 = new PlaceBuilder()
                .name("신규 카페")
                .roadAddressName("서울시 강남구 신규로 456")
                .longitude(20.456)
                .latitude(20.456)
                .routieSpace(testRoutieSpace)
                .build();
        placeRepository.save(place2);
    }

    @Test
    @DisplayName("V2 API로 장소 목록을 조회한다")
    public void readPlacesV2() {
        // when
        Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(responseBody).isNotNull();
        assertThat(responseBody.places()).hasSize(2);

        responseBody.places().forEach(place -> {
            assertThat(place.id()).isNotNull();
            assertThat(place.name()).isNotNull();
            assertThat(place.roadAddressName()).isNotNull();
            assertThat(place.addressName()).isNotNull();
            assertThat(place.longitude()).isNotNull();
            assertThat(place.latitude()).isNotNull();
            assertThat(place.likeCount()).isNotNull();
        });
    }

    @Test
    @DisplayName("V2 API로 조회 시 좋아요 수가 정확히 반환된다")
    public void readPlacesV2WithCorrectLikeCount() {
        // given
        for (int i = 0; i < 3; i++) {
            PlaceLike placeLike = new PlaceLikeBuilder()
                    .place(place1)
                    .build();
            placeLikeRepository.save(placeLike);
        }

        // when
        Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

        // then
        PlaceCardResponseV2 placeWithLikes = responseBody.places().stream()
                .filter(place -> place.id().equals(place1.getId()))
                .findFirst()
                .orElseThrow();

        PlaceCardResponseV2 placeWithoutLikes = responseBody.places().stream()
                .filter(place -> place.id().equals(place2.getId()))
                .findFirst()
                .orElseThrow();

        assertThat(placeWithLikes.likeCount()).isEqualTo(3);
        assertThat(placeWithoutLikes.likeCount()).isEqualTo(0);
    }

    @Test
    @DisplayName("V2 API로 존재하지 않는 루티 스페이스 조회 시 예외가 발생한다")
    public void readPlacesV2WithNonExistentRoutieSpace() {
        // given
        String nonExistentIdentifier = "non-existent-identifier";

        // when
        Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + nonExistentIdentifier + "/places")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V2 API로 빈 루티 스페이스 조회 시 빈 배열을 반환한다")
    public void readPlacesV2WithEmptyRoutieSpace() {
        // given
        RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));

        // when
        Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + emptyRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(responseBody.places()).isEmpty();
    }
}
