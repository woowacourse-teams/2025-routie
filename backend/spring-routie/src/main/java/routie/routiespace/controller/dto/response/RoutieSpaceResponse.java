package routie.routiespace.controller.dto.response;

import java.util.List;
import routie.routie.domain.Routie;
import routie.routiespace.domain.RoutieSpace;

public record RoutieSpaceResponse(
        List<RoutieResponse> routies
) {

    public static RoutieSpaceResponse from(final RoutieSpace routieSpace) {
        return new RoutieSpaceResponse(
                routieSpace.getRouties().stream()
                        .map(RoutieResponse::from)
                        .toList()
        );
    }

    record RoutieResponse(
            Long id
    ) {

        public static RoutieResponse from(final Routie routie) {
            return new RoutieResponse(routie.getId());
        }
    }
}
