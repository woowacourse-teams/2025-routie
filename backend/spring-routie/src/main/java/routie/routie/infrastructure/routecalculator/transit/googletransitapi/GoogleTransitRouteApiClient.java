package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestClient;

@RequiredArgsConstructor
public class GoogleTransitRouteApiClient {

    private final RestClient restClient;

    public GoogleTransitRouteApiResponse getRoute(final GoogleTransitRouteApiRequest request) {
        return restClient.post()
                .uri("/directions/v2:computeRoutes")
                .body(request)
                .retrieve()
                .body(GoogleTransitRouteApiResponse.class);
    }
}
