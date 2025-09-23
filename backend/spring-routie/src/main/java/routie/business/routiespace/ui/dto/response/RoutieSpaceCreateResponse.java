package routie.business.routiespace.ui.dto.response;

import routie.business.routiespace.domain.RoutieSpace;

public record RoutieSpaceCreateResponse(
        String routieSpaceIdentifier
) {

    public static RoutieSpaceCreateResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceCreateResponse(routieSpace.getIdentifier());
    }
}
