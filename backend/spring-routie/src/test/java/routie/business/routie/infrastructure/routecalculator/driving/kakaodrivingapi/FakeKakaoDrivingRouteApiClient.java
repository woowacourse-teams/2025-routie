package routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.RouteResponse;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.SectionResponse;

import java.util.List;

public class FakeKakaoDrivingRouteApiClient extends KakaoDrivingRouteApiClient {

    public FakeKakaoDrivingRouteApiClient() {
        super(null);
    }

    @Override
    public KakaoDrivingRouteApiResponse getRoute(final KakaoDrivingRouteApiRequest request) {
        final SectionResponse mockSection = new SectionResponse(100, 1000);
        final RouteResponse mockRoute = new RouteResponse(List.of(mockSection));
        return new KakaoDrivingRouteApiResponse(List.of(mockRoute));
    }
}
