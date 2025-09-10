package routie.place.ui.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PlaceCreateRequest(
        @NotBlank String searchedPlaceId,
        @NotBlank String name,
        String roadAddressName,
        @NotBlank String addressName,
        @NotNull Double longitude,
        @NotNull Double latitude
) {
}
