package routie.business.hashtag.ui.v1;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;

import java.util.List;

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
import routie.business.hashtag.domain.Hashtag;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.hashtag.ui.dto.response.HashtagsResponse;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;

@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class HashtagControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Autowired
    private HashtagRepository hashtagRepository;

    private RoutieSpace testRoutieSpace1;
    private RoutieSpace testRoutieSpace2;
    private Place place1;
    private Place place2;
    private Place place3;
    private Hashtag hashtag1;
    private Hashtag hashtag2;
    private Hashtag hashtag3;
    private Hashtag hashtag4;
    private Hashtag hashtag5;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        testRoutieSpace1 = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));

        testRoutieSpace2 = routieSpaceRepository.save(RoutieSpace.withIdentifierProvider(
                null, routieSpaceIdentifierProvider
        ));

        place1 = new PlaceBuilder()
                .name("인기 카페")
                .roadAddressName("서울시 강남구 인기로 123")
                .longitude(10.123)
                .latitude(10.123)
                .routieSpace(testRoutieSpace1)
                .build();
        hashtag1 = hashtagRepository.save(new Hashtag("hash", testRoutieSpace1));
        hashtag2 = hashtagRepository.save(new Hashtag("tag", testRoutieSpace1));
        hashtag3 = hashtagRepository.save(new Hashtag("hashtag", testRoutieSpace1));
        hashtag4 = hashtagRepository.save(new Hashtag("hhash", testRoutieSpace2));
        hashtag5 = hashtagRepository.save(new Hashtag("ttag", testRoutieSpace2));

        place1.addHashtags(List.of(hashtag1, hashtag2));
        placeRepository.save(place1);

        place2 = new PlaceBuilder()
                .name("신규 카페")
                .roadAddressName("서울시 강남구 신규로 456")
                .longitude(20.456)
                .latitude(20.456)
                .routieSpace(testRoutieSpace1)
                .build();
        place2.addHashtags(List.of(hashtag1, hashtag3));
        placeRepository.save(place2);

        place3 = new PlaceBuilder()
                .name("신규 카페")
                .roadAddressName("서울시 강남구 신규로 456")
                .longitude(20.456)
                .latitude(20.456)
                .routieSpace(testRoutieSpace2)
                .build();
        place3.addHashtags(List.of(hashtag4, hashtag5));
        placeRepository.save(place3);
    }

    @Test
    @DisplayName("V1 API로 루티 스페이스 내부의 모든 해시태그를 조회할 수 있다")
    public void getHashtagsInRoutieSpaceTest() {
        // given
        final String routieSpaceIdentifier = testRoutieSpace1.getIdentifier();

        // when
        final Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}/hashtags", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final HashtagsResponse hashtagsResponse = response.as(HashtagsResponse.class);

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(hashtagsResponse.hashtags()).hasSize(3);
        assertThat(hashtagsResponse.hashtags()).containsExactlyInAnyOrder("hash", "tag", "hashtag");
    }

    @Test
    @DisplayName("V1 API로 해시태그를 삭제할 수 있다")
    public void deleteHashtagTest() {
        // given
        final String routieSpaceIdentifier = testRoutieSpace1.getIdentifier();
        final Hashtag hashtagToDelete = hashtag1;

        // when
        final Response response = RestAssured
                .when()
                .delete(
                        "/v1/routie-spaces/{routieSpaceIdentifier}/hashtags/{hashtagId}",
                        routieSpaceIdentifier, hashtagToDelete.getId()
                )
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.NO_CONTENT;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    @Test
    @DisplayName("존재하지 않는 해시태그 삭제 시 404 에러를 반환한다")
    public void deleteNonExistentHashtagTest() {
        // given
        final String routieSpaceIdentifier = testRoutieSpace1.getIdentifier();
        final Long nonExistentHashtagId = 999999L;

        // when
        final Response response = RestAssured
                .when()
                .delete(
                        "/v1/routie-spaces/{routieSpaceIdentifier}/hashtags/{hashtagId}",
                        routieSpaceIdentifier, nonExistentHashtagId
                )
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    @Test
    @DisplayName("다른 루티 스페이스의 해시태그 삭제 시 404 에러를 반환한다")
    public void deleteHashtagFromDifferentRoutieSpaceTest() {
        // given
        final String routieSpaceIdentifier1 = testRoutieSpace1.getIdentifier();
        final Hashtag hashtagInSpace2 = hashtag5;

        // when
        final Response response = RestAssured
                .when()
                .delete(
                        "/v1/routie-spaces/{routieSpaceIdentifier}/hashtags/{hashtagId}",
                        routieSpaceIdentifier1, hashtagInSpace2.getId()
                )
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.NOT_FOUND;

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
    }

    @Test
    @DisplayName("V1 API로 해시태그 사용 히스토리를 조회할 수 있다 - 사용 빈도순 정렬")
    public void readHashtagHistoryTest() {
        // given
        final String routieSpaceIdentifier = testRoutieSpace1.getIdentifier();

        // place1: hashtag1(hash), hashtag2(tag)
        // place2: hashtag1(hash), hashtag3(hashtag)
        // 예상 순서: hash(2번), hashtag(1번), tag(1번)
        // 같은 빈도일 경우 이름순: hashtag < tag

        // when
        final Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}/hashtags/history", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final List<String> hashtags = response.jsonPath().getList("hashtags", String.class);

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(hashtags).hasSize(3);
        assertThat(hashtags.get(0)).isEqualTo("hash");
        assertThat(hashtags.get(1)).isEqualTo("hashtag");
        assertThat(hashtags.get(2)).isEqualTo("tag");
    }
}
