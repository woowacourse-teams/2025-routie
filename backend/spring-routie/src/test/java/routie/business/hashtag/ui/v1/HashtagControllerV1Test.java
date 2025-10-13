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

    private RoutieSpace testRoutieSpace1;
    private RoutieSpace testRoutieSpace2;
    private Place place1;
    private Place place2;
    private Place place3;
    @Autowired
    private HashtagRepository hashtagRepository;

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
        final Hashtag hashtag1 = hashtagRepository.save(new Hashtag("hash", testRoutieSpace1));
        final Hashtag hashtag2 = hashtagRepository.save(new Hashtag("tag", testRoutieSpace1));
        final Hashtag hashtag3 = hashtagRepository.save(new Hashtag("hashtag", testRoutieSpace1));
        final Hashtag hashtag4 = hashtagRepository.save(new Hashtag("hhash", testRoutieSpace2));
        final Hashtag hashtag5 = hashtagRepository.save(new Hashtag("ttag", testRoutieSpace2));

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
        Response response = RestAssured
                .when()
                .get("/v1/routie-spaces/{routieSpaceIdentifier}/hashtags", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.OK;

        final HashtagsResponse hashtagsResponse = response.as(HashtagsResponse.class);

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);
        assertThat(hashtagsResponse.hashtags()).hasSize(3);
        assertThat(hashtagsResponse.hashtags()).containsExactlyInAnyOrder("hash", "tag", "hashtag");
    }
}
