package routie.routie.domain.route;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import routie.routie.domain.RoutiePlace;

public class Routes {
    private final TreeMap<RoutiePlace, Route> routes;

    public Routes(final Map<RoutiePlace, Route> routes) {
        this.routes = new TreeMap<>(Comparator.comparing(RoutiePlace::getSequence));
        this.routes.putAll(routes);
    }

    public Route getBy(final RoutiePlace routiePlace) {
        return routes.get(routiePlace);
    }

    public boolean contains(final RoutiePlace routiePlace) {
        return routes.containsKey(routiePlace);
    }

    public List<Route> toList() {
        return new ArrayList<>(routes.values());
    }

    public Set<RoutiePlace> routiePlaces() {
        return routes.keySet();
    }
}
