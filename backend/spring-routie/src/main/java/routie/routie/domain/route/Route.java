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

    public Route {
        validateOrigin(from);
        validateDestination(to);
        validateMovingStrategy(movingStrategy);
    }

    private void validateOrigin(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new IllegalArgumentException("출발지는 null일 수 없습니다.");
        }
    }

    private void validateDestination(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new IllegalArgumentException("도착지는 null일 수 없습니다.");
        }
    }

    private void validateMovingStrategy(final MovingStrategy movingStrategy) {
        if (movingStrategy == null) {
            throw new IllegalArgumentException("이동 전략은 null일 수 없습니다.");
        }
    }
}
