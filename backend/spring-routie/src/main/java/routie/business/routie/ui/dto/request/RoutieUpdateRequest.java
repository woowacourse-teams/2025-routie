package routie.business.routie.ui.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RoutieUpdateRequest(
        @NotNull List<RoutiePlaceRequest> routiePlaces
) {

    public record RoutiePlaceRequest(
            @NotNull Long placeId,
            @NotNull Integer sequence
    ) {
    }
}
