package routie.business.place.ui.v1;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.List;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import routie.business.place.ui.dto.response.SearchedPlacesResponse;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.domain.SearchedPlace;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class PlaceSearchControllerV1Test {

    @LocalServerPort
    private int port;

    @MockitoBean
    private PlaceSearcher placeSearcher;

    private List<SearchedPlace> stubbedSearchedPlaces;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        stubbedSearchedPlaces = List.of(
                new SearchedPlace(
                        "21160804",
                        "선릉역 2호선",
                        "서울 강남구 삼성동 172-66",
                        "서울 강남구 테헤란로 지하 340",
                        127.04896282498558,
                        37.504497373023206
                ),
                new SearchedPlace(
                        "21161056",
                        "선릉역 수인분당선",
                        "서울 강남구 삼성동 172-66",
                        "서울 강남구 테헤란로 지하 340",
                        127.04896282498558,
                        37.504497373023206
                ),
                new SearchedPlace(
                        "574850200",
                        "선릉역풍림아이원레몬아파트",
                        "서울 강남구 대치동 890-54",
                        "서울 강남구 테헤란로64길 13",
                        127.05143263193,
                        37.504179169604114
                )
        );

        when(placeSearcher.searchPlaces(anyString(), eq(5)))
                .thenReturn(stubbedSearchedPlaces);
    }

    @Test
    @DisplayName("V1 API로 장소를 검색한다.")
    void searchPlacesSuccessfully() {
        // given
        String query = "선릉역";

        // when
        SearchedPlacesResponse searchedPlacesResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .queryParam("query", query)
                .when()
                .get("/v1/places/search")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(SearchedPlacesResponse.class);

        // then
        SoftAssertions.assertSoftly(softAssertions -> {
            softAssertions.assertThat(searchedPlacesResponse).isNotNull();
            softAssertions.assertThat(searchedPlacesResponse.searchedPlaces()).isNotEmpty();
            softAssertions.assertThat(searchedPlacesResponse.searchedPlaces()).hasSize(stubbedSearchedPlaces.size());
        });
    }
}
