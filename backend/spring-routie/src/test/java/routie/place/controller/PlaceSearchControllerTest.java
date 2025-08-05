package routie.place.controller;

import static org.mockito.ArgumentMatchers.anyString;
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
import routie.place.controller.dto.response.SearchedPlacesResponse;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class PlaceSearchControllerTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private PlaceSearcher placeSearcher;

    private List<SearchedPlace> stubbedSearchedPlaces;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;

        stubbedSearchedPlaces = List.of(
                new SearchedPlace("1", "카카오프렌즈샵 강남점", "서울 강남구 강남대로 429", 37.509939, 127.027962),
                new SearchedPlace("2", "스타벅스 강남역점", "서울 강남구 테헤란로 101", 37.498095, 127.027581)
        );

        when(placeSearcher.search(anyString()))
                .thenReturn(stubbedSearchedPlaces);
    }

    @Test
    @DisplayName("장소를 검색한다.")
    void searchPlacesSuccessfully() {
        // given
        String query = "강남";

        // when
        SearchedPlacesResponse searchedPlacesResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .queryParam("query", query)
                .when()
                .get("/places/search")
                .then().log().all()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .as(SearchedPlacesResponse.class);

        // then
        SoftAssertions.assertSoftly(softAssertions -> {
            softAssertions.assertThat(searchedPlacesResponse).isNotNull();
            softAssertions.assertThat(searchedPlacesResponse.searchPlaces()).isNotEmpty();
            softAssertions.assertThat(searchedPlacesResponse.searchPlaces()).hasSize(stubbedSearchedPlaces.size());
        });
    }
}
