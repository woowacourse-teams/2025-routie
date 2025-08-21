package routie.routie.domain.route;

import routie.exception.BusinessException;
import routie.exception.ErrorCode;
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
            throw new BusinessException(ErrorCode.ROUTE_ORIGIN_NULL);
        }
    }

    private void validateDestination(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new BusinessException(ErrorCode.ROUTE_DESTINATION_NULL);
        }
    }
}
