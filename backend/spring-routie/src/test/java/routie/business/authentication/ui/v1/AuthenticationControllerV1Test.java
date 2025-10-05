package routie.business.authentication.ui.v1;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.authentication.ui.v1.dto.request.GuestAuthenticationRequest;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestBuilder;
import routie.business.participant.domain.GuestRepository;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class AuthenticationControllerV1Test {

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
    private GuestRepository guestRepository;

    @Autowired
    private JwtProcessor jwtProcessor;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RoutieSpace testRoutieSpace;

    private Guest testGuest;

    private String testGuestPassword;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        testRoutieSpace = routieSpaceRepository.save(
                RoutieSpace.withIdentifierProvider(null, routieSpaceIdentifierProvider)
        );

        testGuestPassword = "danny";

        testGuest = guestRepository.save(
                new GuestBuilder()
                        .nickname("피곤한 대니")
                        .password(passwordEncoder.encode(testGuestPassword))
                        .routieSpace(testRoutieSpace)
                        .build()
        );
    }

    @Test
    @DisplayName("V1 API를 통해 Guest로 회원가입하고 JWT를 발급받는다.")
    void signInAsGuest() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                "피곤한 차니",
                "channy",
                testRoutieSpace.getId()
        );

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/v1/authentication/guest")
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.body()).isNotNull();
    }

    @Test
    @DisplayName("비밀번호가 틀리면 로그인에 실패한다.")
    void signInAsGuest_withInvalidPassword() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                testGuest.getNickname(),
                testGuestPassword + "wrong",
                testRoutieSpace.getId()
        );

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/v1/authentication/guest")
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }
}
