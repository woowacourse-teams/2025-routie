package routie.routie.domain.timeperiod;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.routie.domain.RoutiePlace;

public class TimePeriods {

    private static final Comparator<RoutiePlace> ROUTIE_PLACE_COMPARATOR =
            Comparator.comparing(RoutiePlace::getSequence);

    private final TreeMap<RoutiePlace, TimePeriod> timePeriods;

    public TimePeriods(final Map<RoutiePlace, TimePeriod> timePeriods) {
        validateTimePeriods(timePeriods);
        this.timePeriods = new TreeMap<>(ROUTIE_PLACE_COMPARATOR);
        this.timePeriods.putAll(timePeriods);
    }

    public static TimePeriods empty() {
        return new TimePeriods(new TreeMap<>(ROUTIE_PLACE_COMPARATOR));
    }

    private void validateTimePeriods(final Map<RoutiePlace, TimePeriod> timePeriods) {
        if (timePeriods == null) {
            throw new BusinessException(ErrorCode.TIME_PERIODS_NULL);
        }
    }

    public TimePeriods withAdded(final RoutiePlace routiePlace, final TimePeriod timePeriod) {
        validateRoutiePlace(routiePlace);
        validateTimePeriod(timePeriod);
        Map<RoutiePlace, TimePeriod> newTimePeriods = new TreeMap<>(ROUTIE_PLACE_COMPARATOR);
        newTimePeriods.putAll(this.timePeriods);
        newTimePeriods.put(routiePlace, timePeriod);

        return new TimePeriods(newTimePeriods);
    }

    public TimePeriod getByRoutiePlace(final RoutiePlace place) {
        validateRoutiePlace(place);
        return timePeriods.get(place);
    }

    public void add(final RoutiePlace routiePlace, final TimePeriod timePeriod) {
        validateRoutiePlace(routiePlace);
        validateTimePeriod(timePeriod);
        timePeriods.put(routiePlace, timePeriod);
    }

    public boolean contains(final RoutiePlace routiePlace) {
        return timePeriods.containsKey(routiePlace);
    }

    private void validateRoutiePlace(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new BusinessException(ErrorCode.TIME_PERIOD_ROUTIE_PLACE_NULL);
        }
    }

    private void validateTimePeriod(final TimePeriod timePeriod) {
        if (timePeriod == null) {
            throw new BusinessException(ErrorCode.TIME_PERIOD_NULL);
        }
    }

    public int size() {
        return timePeriods.size();
    }

    public List<TimePeriod> orderedList() {
        return List.copyOf(timePeriods.values());
    }

    public List<RoutiePlace> routiePlaces() {
        return List.copyOf(timePeriods.keySet());
    }
}
