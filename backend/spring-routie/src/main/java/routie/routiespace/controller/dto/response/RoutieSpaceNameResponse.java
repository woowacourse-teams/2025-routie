package routie.routiespace.controller.dto.response;

import routie.routiespace.domain.RoutieSpace;

public record RoutieSpaceNameResponse(
        String name
) {

    public static RoutieSpaceNameResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceNameResponse(routieSpace.getName());
    }
}
