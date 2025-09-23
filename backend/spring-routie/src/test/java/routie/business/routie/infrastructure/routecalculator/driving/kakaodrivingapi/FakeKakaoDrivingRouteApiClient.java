package routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import java.util.List;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiClient;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiRequest;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.RouteResponse;
import routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi.KakaoDrivingRouteApiResponse.SectionResponse;

public class FakeKakaoDrivingRouteApiClient extends KakaoDrivingRouteApiClient {

    public FakeKakaoDrivingRouteApiClient() {
        super(null);
    }

    @Override
    public KakaoDrivingRouteApiResponse getRoute(final KakaoDrivingRouteApiRequest request) {
        SectionResponse mockSection = new SectionResponse(100, 1000);
        RouteResponse mockRoute = new RouteResponse(List.of(mockSection));
        return new KakaoDrivingRouteApiResponse(List.of(mockRoute));
    }
}
