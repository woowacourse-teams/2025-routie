package routie.business.routiespace.ui.dto.response;

import routie.business.routiespace.domain.RoutieSpace;

public record RoutieSpaceReadResponse(
        String name
) {

    public static RoutieSpaceReadResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceReadResponse(routieSpace.getName());
    }
}
