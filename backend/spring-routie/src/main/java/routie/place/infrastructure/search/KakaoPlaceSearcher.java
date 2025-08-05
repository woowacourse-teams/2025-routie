package routie.place.infrastructure.search;

import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;

@Component
@RequiredArgsConstructor
public class KakaoPlaceSearcher implements PlaceSearcher {

    private static final int SEARCH_SIZE = 5;

    private final RestClient kakaoRestClient;

    @Override
    public List<SearchedPlace> search(final String query) {
        KakaoPlaceSearchResponse kakaoPlaceSearchResponse = Objects.requireNonNull(
                kakaoRestClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/v2/local/search/keyword.json")
                                .queryParam("query", query)
                                .queryParam("size", SEARCH_SIZE)
                                .build())
                        .retrieve()
                        .body(KakaoPlaceSearchResponse.class),
                "Kakao API 응답이 null입니다."
        );

        return kakaoPlaceSearchResponse.documents()
                .stream()
                .map(SearchedPlace::from)
                .toList();
    }
}
