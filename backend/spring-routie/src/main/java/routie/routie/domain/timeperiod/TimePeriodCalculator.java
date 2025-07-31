package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.stereotype.Component;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.Routes;

@Component
public class TimePeriodCalculator {

    public TimePeriods calculateTimePeriods(
            final LocalDateTime initialStartTime,
            final Routes routes
    ) {
        TimePeriods timePeriods = TimePeriods.empty();
        Set<RoutiePlace> orderedRoutiePlaces = routes.orderedRoutiePlaces();
        LocalDateTime currentTime = initialStartTime;

        for (final RoutiePlace routiePlace : orderedRoutiePlaces) {
            LocalDateTime start = currentTime;
            LocalDateTime end = start.plusMinutes(routiePlace.getPlace().getStayDurationMinutes());

            timePeriods.add(routiePlace, new TimePeriod(routiePlace, start, end));

            Route route = routes.getBy(routiePlace);
            if (route != null) {
                currentTime = end.plusMinutes(route.duration());
            }
        }

        return timePeriods;
    }
}
