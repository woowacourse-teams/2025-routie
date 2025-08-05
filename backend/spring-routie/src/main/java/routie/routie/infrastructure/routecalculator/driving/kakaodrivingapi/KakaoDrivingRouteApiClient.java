package routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestClient;

@RequiredArgsConstructor
public class KakaoDrivingRouteApiClient {

    private final RestClient restClient;

    public KakaoDrivingRouteApiResponse getRoute(final KakaoDrivingRouteApiRequest request) {
        return restClient.post()
                .body(request)
                .retrieve()
                .body(KakaoDrivingRouteApiResponse.class);
    }
}
