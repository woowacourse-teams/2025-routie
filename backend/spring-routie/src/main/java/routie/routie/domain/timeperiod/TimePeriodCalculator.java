package routie.routie.domain.timeperiod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;

@Component
public class TimePeriodCalculator {

    public Map<Integer, TimePeriod> calculateTimePeriods(
            final List<RoutiePlace> routiePlaces,
            final LocalDateTime initialStartTime,
            final Map<Integer, Route> routeByFromSequence
    ) {
        Map<Integer, TimePeriod> timePeriodBySequence = new HashMap<>();

        LocalDateTime currentTime = initialStartTime;

        for (int i = 1; i < routiePlaces.size() + 1; i++) {
            RoutiePlace routiePlace = routiePlaces.get(i);
            LocalDateTime start = currentTime;
            LocalDateTime end = start.plusMinutes(routiePlace.getPlace().getStayDurationMinutes());

            timePeriodBySequence.put(routiePlace.getSequence(), new TimePeriod(start, end));

            if (i < routeByFromSequence.size()) {
                currentTime = end.plusMinutes(routeByFromSequence.get(i).duration());
            }
        }

        return timePeriodBySequence;
    }
}
