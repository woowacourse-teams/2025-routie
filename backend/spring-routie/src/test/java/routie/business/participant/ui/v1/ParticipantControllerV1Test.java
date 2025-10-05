package routie.business.participant.ui.v1;

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
import routie.business.authentication.domain.Role;
import routie.business.authentication.domain.jwt.JwtProcessor;
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
public class ParticipantControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private JwtProcessor jwtProcessor;

    private RoutieSpace testRoutieSpace;

    private Place testPlace;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        guestRepository.deleteAll();
        routieSpaceRepository.deleteAll();
        userRepository.deleteAll();

        testRoutieSpace = routieSpaceRepository.save(
                RoutieSpace.withIdentifierProvider(null, routieSpaceIdentifierProvider)
        );

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
    @DisplayName("User는 자신의 정보를 가져올 수 있다.")
    void getMyInformation_withUserToken() {
        // given
        User user = UserFixture.emptyUser();
        userRepository.save(user);
        String accessToken = jwtProcessor.createJwt(user);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().get("/v1/participants/me")
                .then().log().all()
                .extract()
                .response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getString("role")).isEqualTo(Role.USER.toString());
    }

    @Test
    @DisplayName("Guest는 자신의 정보를 가져올 수 있다.")
    void getMyInformation_withGuestToken() {
        // given
        Guest guest = new GuestBuilder()
                .routieSpace(testRoutieSpace)
                .build();

        guestRepository.save(guest);
        String accessToken = jwtProcessor.createJwt(guest);

        // when
        Response response = RestAssured
                .given().log().all()
                .header("Authorization", "Bearer " + accessToken)
                .when().get("/v1/participants/me")
                .then().log().all()
                .extract()
                .response();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getString("role")).isEqualTo(Role.GUEST.toString());
    }
}
