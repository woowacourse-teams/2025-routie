package routie.routiespace.controller.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RoutieSpaceNameUpdateRequest(
        @NotBlank String name
) {

}
