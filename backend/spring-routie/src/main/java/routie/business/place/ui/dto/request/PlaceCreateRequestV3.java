package routie.business.place.ui.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PlaceCreateRequestV3(
        @NotBlank String searchedPlaceId,
        @NotBlank String name,
        String roadAddressName,
        @NotBlank String addressName,
        @NotNull Double longitude,
        @NotNull Double latitude,
        @NotNull List<String> hashtags
) {
}
