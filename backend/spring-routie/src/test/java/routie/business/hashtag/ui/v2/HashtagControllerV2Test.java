package routie.business.hashtag.ui.v2;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import routie.business.hashtag.domain.Hashtag;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.hashtag.ui.dto.response.HashtagsResponseV2;
import routie.business.hashtag.ui.dto.response.HashtagsResponseV2.HashtagResponse;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.util.DatabaseCleaner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HashtagControllerV2Test {

    @LocalServerPort
    private int port;

    @Autowired
    private DatabaseCleaner databaseCleaner;

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

    @AfterEach
    void tearDown() {
        databaseCleaner.execute();
    }

    @Test
    @DisplayName("V1 API로 루티 스페이스 내부의 모든 해시태그를 조회할 수 있다")
    public void getHashtagsInRoutieSpaceTest() {
        // given
        final String routieSpaceIdentifier = testRoutieSpace1.getIdentifier();

        // when
        final Response response = RestAssured
                .when()
                .get("/v2/routie-spaces/{routieSpaceIdentifier}/hashtags", routieSpaceIdentifier)
                .then()
                .log().all()
                .extract().response();

        final HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        final HttpStatus expectedHttpStatus = HttpStatus.OK;

        final HashtagsResponseV2 hashtagsResponseV2 = response.as(HashtagsResponseV2.class);

        // then
        assertThat(actualHttpStatus).isEqualTo(expectedHttpStatus);

        final List<String> names = hashtagsResponseV2.hashtags().stream()
                .map(HashtagResponse::name)
                .toList();
        final List<Long> ids = hashtagsResponseV2.hashtags().stream()
                .map(HashtagResponse::id)
                .toList();
        final List<Long> counts = hashtagsResponseV2.hashtags().stream()
                .map(HashtagResponse::count)
                .toList();

        assertThat(names).hasSize(3);
        assertThat(names).containsExactlyInAnyOrder("hash", "tag", "hashtag");
        assertThat(ids).contains(hashtag1.getId(), hashtag2.getId(), hashtag3.getId());

        final int hashIndex = names.indexOf("hash");
        final int tagIndex = names.indexOf("tag");
        final int hashtagIndex = names.indexOf("hashtag");

        assertThat(counts.get(hashIndex)).isEqualTo(2L);
        assertThat(counts.get(hashtagIndex)).isEqualTo(1L);
        assertThat(counts.get(tagIndex)).isEqualTo(1L);
    }
}
