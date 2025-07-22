package routie.routiespace.controller.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record UpdateRoutieSpaceNameRequest(
        @NotEmpty String name
) {

}
