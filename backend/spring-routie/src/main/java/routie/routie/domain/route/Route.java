package routie.routie.domain.route;

import routie.routie.domain.RoutiePlace;

public record Route(
        RoutiePlace from,
        RoutiePlace to,
        int duration,
        int distance
) {

    public Route {
        validateOrigin(from);
        validateDestination(to);
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
}
