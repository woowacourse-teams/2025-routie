package routie.business.routiespace.ui.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RoutieSpaceUpdateRequest(
        @NotBlank String name
) {

}
