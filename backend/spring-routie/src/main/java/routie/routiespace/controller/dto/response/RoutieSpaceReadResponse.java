package routie.routiespace.controller.dto.response;

import routie.routiespace.domain.RoutieSpace;

public record RoutieSpaceReadResponse(
        String name
) {

    public static RoutieSpaceReadResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceReadResponse(routieSpace.getName());
    }
}
