package routie.routie.domain.timeperiod;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import routie.routie.domain.RoutiePlace;

public class TimePeriods {
    private final TreeMap<RoutiePlace, TimePeriod> timePeriods;

    public TimePeriods(final Map<RoutiePlace, TimePeriod> timePeriods) {
        this.timePeriods = new TreeMap<>(Comparator.comparing(RoutiePlace::getSequence));
        this.timePeriods.putAll(timePeriods);
    }

    public static TimePeriods empty() {
        return new TimePeriods(new TreeMap<>(Comparator.comparing(RoutiePlace::getSequence)));
    }

    public TimePeriod getBy(final RoutiePlace place) {
        return timePeriods.get(place);
    }

    public void add(final RoutiePlace routiePlace, final TimePeriod timePeriod) {
        timePeriods.put(routiePlace, timePeriod);
    }

    public boolean contains(final RoutiePlace place) {
        return timePeriods.containsKey(place);
    }

    public int size() {
        return timePeriods.size();
    }

    public List<TimePeriod> orderedList() {
        return List.copyOf(timePeriods.values());
    }

    public Set<RoutiePlace> routiePlaces() {
        return timePeriods.keySet();
    }
}
