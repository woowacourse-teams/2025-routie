package routie.routie.controller.dto.request;

import java.util.List;

public record RoutieUpdateRequest(
        List<RoutiePlaceRequest> routiePlaces
) {
    public record RoutiePlaceRequest(
            int sequence,
            Long placeId
    ) {
    }
}
