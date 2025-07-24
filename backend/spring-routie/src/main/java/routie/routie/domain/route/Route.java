package routie.routie.domain.route;

import routie.place.domain.MovingStrategy;

public record Route(
        int fromSequence,
        int toSequence,
        MovingStrategy movingStrategy,
        int duration,
        int distance
) {
}
