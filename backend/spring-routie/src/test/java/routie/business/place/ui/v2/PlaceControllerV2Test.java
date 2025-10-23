package routie.business.place.ui.v2;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
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
import routie.business.like.domain.PlaceLike;
import routie.business.like.domain.PlaceLikeBuilder;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.place.ui.dto.request.PlaceCreateRequestV2;
import routie.business.place.ui.dto.response.PlaceCreateResponse;
import routie.business.place.ui.dto.response.PlaceListResponseV2;
import routie.business.place.ui.dto.response.PlaceListResponseV2.PlaceCardResponseV2;
import routie.business.place.ui.dto.response.PlaceReadResponse;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

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

    @Autowired
    private UserRepository userRepository;

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
        final Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

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
            assertThat(place.hashtags()).isNotNull();
        });
    }

    @Test
    @DisplayName("V2 API로 조회 시 좋아요 수가 정확히 반환된다")
    public void readPlacesV2WithCorrectLikeCount() {
        // given
        final User user = userRepository.save(UserFixture.emptyUser());

        for (int i = 0; i < 3; i++) {
            final PlaceLike placeLike = new PlaceLikeBuilder()
                    .place(place1)
                    .user(user)
                    .build();
            placeLikeRepository.save(placeLike);
        }

        // when
        final Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        final PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

        // then
        final PlaceCardResponseV2 placeWithLikes = responseBody.places().stream()
                .filter(place -> place.id().equals(place1.getId()))
                .findFirst()
                .orElseThrow();

        final PlaceCardResponseV2 placeWithoutLikes = responseBody.places().stream()
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
        final String nonExistentIdentifier = "non-existent-identifier";

        // when
        final Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + nonExistentIdentifier + "/places")
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V2 API로 빈 루티 스페이스 조회 시 빈 배열을 반환한다")
    public void readPlacesV2WithEmptyRoutieSpace() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));

        // when
        final Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/" + emptyRoutieSpace.getIdentifier() + "/places")
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final PlaceListResponseV2 responseBody = response.as(PlaceListResponseV2.class);

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(responseBody.places()).isEmpty();
    }

    @Test
    @DisplayName("V2 API로 장소를 추가할 수 있다")
    public void addPlaceV2Test() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "1",
                "place",
                "roadAddress",
                "address",
                89.0,
                89.0,
                List.of("hash", "tag")
        );

        // when
        final Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", emptyRoutieSpace.getIdentifier())
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final PlaceCreateResponse placeCreateResponse = response.as(PlaceCreateResponse.class);

        // then
        final PlaceReadResponse placeReadResponse = readPlaceWithV1(
                emptyRoutieSpace.getIdentifier(),
                placeCreateResponse.id()
        );
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(placeReadResponse.name()).isEqualTo(placeCreateRequest.name());
        assertThat(placeReadResponse.hashtags()).containsExactlyInAnyOrder("hash", "tag");
    }

    @Test
    @DisplayName("V2 API로 해시태그 크기가 5개 초과인 장소를 추가할 수 없다")
    public void addPlaceWithMoreThanFiveHashtagTest() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "1",
                "place",
                "roadAddress",
                "address",
                89.0,
                89.0,
                List.of("hash", "tag", "1", "2", "3", "4")
        );

        // when
        final Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", emptyRoutieSpace.getIdentifier())
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.BAD_REQUEST;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    @Test
    @DisplayName("V2 API로 장소를 추가할 때 중복되는 해시태그는 중복 제거 후 저장된다")
    public void addPlaceV2WithDuplicateHashtagTest() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "1",
                "place",
                "roadAddress",
                "address",
                89.0,
                89.0,
                List.of("hash", "hash")
        );

        // when
        final Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", emptyRoutieSpace.getIdentifier())
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.BAD_REQUEST;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    @Test
    @DisplayName("V2 API로 장소를 추가할 때 해시태그가 비어있어도 추가할 수 있다.")
    public void addPlaceV2WithEmptyHashtagListTest() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "1",
                "place",
                "roadAddress",
                "address",
                89.0,
                89.0,
                List.of()
        );

        // when
        final Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", emptyRoutieSpace.getIdentifier())
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final PlaceCreateResponse placeCreateResponse = response.as(PlaceCreateResponse.class);

        // then
        final PlaceReadResponse placeReadResponse = readPlaceWithV1(
                emptyRoutieSpace.getIdentifier(),
                placeCreateResponse.id()
        );
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(placeReadResponse.name()).isEqualTo(placeCreateRequest.name());
        assertThat(placeReadResponse.hashtags()).isEmpty();
    }

    @Test
    @DisplayName("V2 API로 장소를 추가할 때 해시태그의 길이가 8자 이상이거나 비어있다면 예외가 발생한다")
    public void addPlaceV2WithInvalidLengthHashtagTest() {
        // given
        final RoutieSpace emptyRoutieSpace = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));
        final PlaceCreateRequestV2 placeCreateRequest = new PlaceCreateRequestV2(
                "1",
                "place",
                "roadAddress",
                "address",
                89.0,
                89.0,
                List.of("hashtags", "tag")
        );

        // when
        final Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(placeCreateRequest)
                .when()
                .post("/v2/routie-spaces/{routieSpaceIdentifier}/places", emptyRoutieSpace.getIdentifier())
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.BAD_REQUEST;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    private PlaceReadResponse readPlaceWithV1(final String routieSpaceIdentifier, final long placeId) {
        final Response responsed = RestAssured
                .when()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}/places/{placeId}", routieSpaceIdentifier, placeId)
                .then()
                .log().all()
                .extract().response();
        return responsed.as(PlaceReadResponse.class);
    }
}
