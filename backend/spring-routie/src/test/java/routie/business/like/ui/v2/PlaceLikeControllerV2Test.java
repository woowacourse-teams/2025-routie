package routie.business.like.ui.v2;

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
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestBuilder;
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
public class PlaceLikeControllerV2Test {

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
    private JwtProcessor jwtProcessor;

    private Place testPlace;
    private RoutieSpace testRoutieSpace;
    @Autowired
    private GuestRepository guestRepository;

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
    @DisplayName("V2 API로 장소에 유저의 좋아요를 성공적으로 추가한다")
    public void likePlaceWithUserToken() {
        // given
        long placeId = testPlace.getId();
        long initialLikeCount = placeLikeRepository.countByPlace(testPlace);

        // 테스트용 사용자 생성 및 토큰 발급
        User user = UserFixture.emptyUser();
        userRepository.save(user);
        String accessToken = jwtProcessor.createJwt(user);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .post("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId + "/likes")
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
    @DisplayName("V2 API로 장소에 게스트의 좋아요를 성공적으로 추가한다")
    public void likePlaceWithGuestToken() {
        // given
        long placeId = testPlace.getId();
        long initialLikeCount = placeLikeRepository.countByPlace(testPlace);

        // 테스트용 사용자 생성 및 토큰 발급
        Guest guest = new GuestBuilder()
                .routieSpace(testRoutieSpace)
                .build();

        guestRepository.save(guest);
        String accessToken = jwtProcessor.createJwt(guest);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .post("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + placeId + "/likes")
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
    @DisplayName("V2 API로 존재하지 않는 루티 스페이스에 좋아요 시 예외가 발생한다")
    public void likeWithNonExistentRoutieSpace() {
        // given
        long placeId = testPlace.getId();
        String nonExistentIdentifier = "non-existent-identifier";

        // 테스트용 사용자 생성 및 토큰 발급
        User user = UserFixture.emptyUser();
        userRepository.save(user);
        String accessToken = jwtProcessor.createJwt(user);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .post("/v2/routie-spaces/" + nonExistentIdentifier + "/places/" + placeId + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }

    @Test
    @DisplayName("V2 API로 존재하지 않는 장소에 좋아요 시 예외가 발생한다")
    public void likeNonExistentPlace() {
        // given
        long nonExistentPlaceId = 999999L;

        // 테스트용 사용자 생성 및 토큰 발급
        User user = UserFixture.emptyUser();
        userRepository.save(user);
        String accessToken = jwtProcessor.createJwt(user);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .post("/v2/routie-spaces/" + testRoutieSpace.getIdentifier() + "/places/" + nonExistentPlaceId
                        + "/likes")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
    }
}
