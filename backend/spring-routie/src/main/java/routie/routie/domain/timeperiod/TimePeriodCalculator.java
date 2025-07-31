package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.Routes;

@Component
public class TimePeriodCalculator {

    public TimePeriods calculateTimePeriods(
            final List<RoutiePlace> routiePlaces,
            final LocalDateTime initialStartTime,
            final Routes routes
    ) {
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace = new HashMap<>();
        LocalDateTime currentTime = initialStartTime;

        for (int i = 0; i < routiePlaces.size(); i++) {
            RoutiePlace currentRoutiePlace = routiePlaces.get(i);

            LocalDateTime start = currentTime;
            LocalDateTime end = start.plusMinutes(currentRoutiePlace.getPlace().getStayDurationMinutes());

            timePeriodByRoutiePlace.put(currentRoutiePlace, new TimePeriod(start, end));

            if (i < routiePlaces.size() - 1) {
                Route route = routes.getBy(currentRoutiePlace);
                currentTime = end.plusMinutes(route.duration());
            }
        }

        return new TimePeriods(timePeriodByRoutiePlace);
    }
}
