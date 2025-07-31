package routie.routie.domain.route;

import routie.place.domain.MovingStrategy;
import routie.routie.domain.RoutiePlace;

public record Route(
        RoutiePlace from,
        RoutiePlace to,
        MovingStrategy movingStrategy,
        int duration,
        int distance
) {
}
