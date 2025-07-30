package routie.routie.controller.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RoutieUpdateRequest(
        @NotNull List<RoutiePlaceRequest> routiePlaces
) {
    public record RoutiePlaceRequest(
            Long placeId,
            int sequence
    ) {
    }
}
