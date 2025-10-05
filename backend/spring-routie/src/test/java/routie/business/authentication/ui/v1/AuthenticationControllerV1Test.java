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
import routie.business.authentication.ui.v1.dto.request.GuestAuthenticationRequest;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestBuilder;
import routie.business.participant.domain.GuestRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class AuthenticationControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RoutieSpace testRoutieSpace;

    private Guest testGuest;

    private Guest testGuestWithNoPassword;

    private String testGuestPassword;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        guestRepository.deleteAll();
        routieSpaceRepository.deleteAll();

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

        testGuestWithNoPassword = guestRepository.save(
                new GuestBuilder()
                        .nickname("비밀번호 없는 대니")
                        .password(null)
                        .routieSpace(testRoutieSpace)
                        .build()
        );
    }

    @Test
    @DisplayName("Guest로 회원가입하고 JWT를 발급받을 수 있다.")
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
    @DisplayName("이미 가입된 사용자가 올바른 비밀번호로 로그인하면 JWT를 발급받는다.")
    void signInAsExistingGuest_withValidPassword() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                testGuest.getNickname(),
                testGuestPassword,
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
        assertThat(response.jsonPath().getString("accessToken")).isNotBlank();
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

    @Test
    @DisplayName("비밀번호가 없는 게스트 사용자는 요청에 password가 없어야 로그인에 성공한다.")
    void signInAsNonPasswordGuest_withNoPasswordRequest() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                testGuestWithNoPassword.getNickname(),
                null,
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
    }

    @Test
    @DisplayName("비밀번호가 있는 사용자가 요청에 password를 null로 보내면 로그인에 실패한다.")
    void signInAsPasswordGuest_withNullPasswordRequest() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                testGuest.getNickname(),
                null,
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

    @Test
    @DisplayName("비밀번호가 없는 사용자가 요청에 임의의 password를 보내면 로그인에 실패한다.")
    void signInAsNonPasswordGuest_withAnyPasswordRequest() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                testGuestWithNoPassword.getNickname(),
                "any-password",
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

    @Test
    @DisplayName("존재하지 않는 routieSpaceId로 요청하면 실패한다.")
    void signIn_withNonExistentRoutieSpaceId() {
        // given
        final long nonExistentRoutieSpaceId = -1L;
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                "아무 닉네임",
                "any-password",
                nonExistentRoutieSpaceId
        );

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/v1/authentication/guest")
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("요청에 nickname이 없으면 400 Bad Request를 반환한다.")
    void signIn_withNullNickname() {
        // given
        final GuestAuthenticationRequest request = new GuestAuthenticationRequest(
                null,
                "any-password",
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
        assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }
}
