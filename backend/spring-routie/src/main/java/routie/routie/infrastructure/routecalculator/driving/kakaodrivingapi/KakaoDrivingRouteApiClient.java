package routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestClient;

@RequiredArgsConstructor
public class KakaoDrivingRouteApiClient {

    private final RestClient restClient;

    public KakaoDrivingRouteApiResponse getRoute(final KakaoDrivingRouteApiRequest request) {
        return restClient.post()
                .uri("/v1/waypoints/directions")
                .body(request)
                .retrieve()
                .body(KakaoDrivingRouteApiResponse.class);
    }
}
