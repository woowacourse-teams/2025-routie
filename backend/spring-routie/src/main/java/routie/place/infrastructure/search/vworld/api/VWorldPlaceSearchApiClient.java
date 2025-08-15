package routie.place.infrastructure.search.vworld.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestClient;
import routie.place.infrastructure.search.vworld.api.dto.request.VWorldPlaceSearchApiRequest;
import routie.place.infrastructure.search.vworld.api.dto.response.VWorldPlaceSearchApiResponse;

@RequiredArgsConstructor
public class VWorldPlaceSearchApiClient {

    private final RestClient restClient;
    private final String apiKey;

    public VWorldPlaceSearchApiResponse search(final VWorldPlaceSearchApiRequest vWorldPlaceSearchApiRequest) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("key", apiKey)
                        .queryParam("request", "search")
                        .queryParam("query", vWorldPlaceSearchApiRequest.query())
                        .queryParam("type", "PLACE")
                        .queryParam("size", vWorldPlaceSearchApiRequest.size())
                        .build()
                )
                .retrieve()
                .body(VWorldPlaceSearchApiResponse.class);
    }
}
