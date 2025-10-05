package routie.business.like.ui.v1;

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
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.like.domain.PlaceLike;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.participant.domain.GuestRepository;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class PlaceLikeControllerV1Test {

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

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private JwtProcessor jwtProcessor;

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
    @Deprecated
    @DisplayName("V1 API로 장소에 좋아요를 성공적으로 추가한다")
    public void likePlace() {
        // given
        long placeId = testPlace.getId();
        long initialLikeCount = placeLikeRepository.countByPlace(testPlace);

        // when
        Response response = RestAssured
                .when()
                .post("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);

        long finalLikeCount = placeLikeRepository.countByPlace(testPlace);
        assertThat(finalLikeCount).isEqualTo(initialLikeCount + 1);
    }

    @Test
    @Deprecated
    @DisplayName("V1 API로 존재하지 않는 루티 스페이스에 좋아요 시 예외가 발생한다")
    public void likeWithNonExistentRoutieSpace() {
        // given
        long placeId = testPlace.getId();
        String nonExistentIdentifier = "non-existent-identifier";

        // when
        Response response = RestAssured
                .when()
                .post("/v1/routie-spaces/" + nonExistentIdentifier + "/places/" + placeId + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @Deprecated
    @DisplayName("V1 API로 존재하지 않는 장소에 좋아요 시 예외가 발생한다")
    public void likeNonExistentPlace() {
        // given
        long nonExistentPlaceId = 999999L;

        // when
        Response response = RestAssured
                .when()
                .post("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + nonExistentPlaceId
                        + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("루티스페이스 내 사용자가 좋아요를 누른 장소의 아이디들을 조회할 수 있다")
    public void getLikedPlaces_withUserToken() {
        // given

        // 테스트용 사용자 생성 및 토큰 발급
        User user = UserFixture.emptyUser();
        userRepository.save(user);
        String accessToken = jwtProcessor.createJwt(user);

        placeLikeRepository.save(PlaceLike.of(testPlace, user));

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get("/v1/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places" + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(response.jsonPath().getList("likedPlaceIds").contains(1)).isTrue();
    }
}
