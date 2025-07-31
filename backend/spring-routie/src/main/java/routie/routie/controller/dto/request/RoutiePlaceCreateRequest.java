package routie.routie.controller.dto.request;

import jakarta.validation.constraints.NotNull;

public record RoutiePlaceCreateRequest(
        @NotNull Long placeId
) {
}
