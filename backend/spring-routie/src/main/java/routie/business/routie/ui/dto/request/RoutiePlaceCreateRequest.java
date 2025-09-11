package routie.business.routie.ui.dto.request;

import jakarta.validation.constraints.NotNull;

public record RoutiePlaceCreateRequest(
        @NotNull Long placeId
) {
}
