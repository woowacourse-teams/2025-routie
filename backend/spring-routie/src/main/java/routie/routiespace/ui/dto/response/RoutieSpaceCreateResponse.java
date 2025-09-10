package routie.routiespace.ui.dto.response;

import routie.routiespace.domain.RoutieSpace;

public record RoutieSpaceCreateResponse(
        String routieSpaceIdentifier
) {

    public static RoutieSpaceCreateResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceCreateResponse(routieSpace.getIdentifier());
    }
}
