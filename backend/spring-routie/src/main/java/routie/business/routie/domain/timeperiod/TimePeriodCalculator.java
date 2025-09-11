package routie.business.routie.domain.timeperiod;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;
import routie.global.exception.BusinessException;
import routie.global.exception.ErrorCode;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.route.Route;
import routie.business.routie.domain.route.Routes;

@Component
public class TimePeriodCalculator {

    public TimePeriods calculateTimePeriods(
            final LocalDateTime startDateTime,
            final Routes routes,
            final List<RoutiePlace> routiePlaces
    ) {
        validateRoutes(routes);
        validateStartDateTime(startDateTime);
        validateRoutiePlaces(routiePlaces);

        TimePeriods timePeriods = TimePeriods.empty();

        if (routiePlaces.size() == 1) {
            RoutiePlace firstRoutiePlace = routiePlaces.getFirst();

            return TimePeriods.empty().
                    withAdded(
                            firstRoutiePlace,
                            new TimePeriod(
                                    firstRoutiePlace,
                                    startDateTime,
                                    startDateTime.plusMinutes(0) // 검증 필드 제거에 따른 구현
                            )
                    );
        }

        List<RoutiePlace> orderedRoutiePlaces = routes.orderedRoutiePlaces();
        LocalDateTime currentTime = startDateTime;

        for (final RoutiePlace routiePlace : orderedRoutiePlaces) {
            LocalDateTime start = currentTime;
            LocalDateTime end = start.plusMinutes(0); // 검증 필드 제거에 따른 구현

            timePeriods = timePeriods.withAdded(routiePlace, new TimePeriod(routiePlace, start, end));

            Route route = routes.getByRoutiePlace(routiePlace);
            if (route != null) {
                currentTime = end.plusMinutes(route.duration());
            }
        }

        return timePeriods;
    }

    private void validateStartDateTime(final LocalDateTime startDateTime) {
        if (startDateTime == null) {
            throw new BusinessException(ErrorCode.TIME_PERIOD_START_TIME_NULL);
        }
    }

    private void validateRoutes(final Routes routes) {
        if (routes == null) {
            throw new BusinessException(ErrorCode.ROUTES_NULL);
        }
    }

    private void validateRoutiePlaces(final List<RoutiePlace> routiePlaces) {
        if (routiePlaces == null) {
            throw new BusinessException(ErrorCode.ROUTIE_PLACES_NULL);
        }
    }
}
