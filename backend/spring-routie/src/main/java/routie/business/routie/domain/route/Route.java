package routie.business.routie.domain.route;

import routie.business.routie.domain.RoutiePlace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

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
