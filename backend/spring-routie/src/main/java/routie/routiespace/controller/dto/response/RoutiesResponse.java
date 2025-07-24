package routie.routiespace.controller.dto.response;

import java.util.List;
import routie.routie.domain.Routie;
import routie.routiespace.domain.RoutieSpace;

public record RoutiesResponse(
        List<RoutieResponse> routies
) {

    public static RoutiesResponse from(final RoutieSpace routieSpace) {
        return new RoutiesResponse(
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
