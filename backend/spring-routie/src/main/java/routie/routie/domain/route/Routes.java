package routie.routie.domain.route;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import routie.routie.domain.RoutiePlace;

public class Routes {
    private static final Comparator<RoutiePlace> ROUTE_COMPARATOR =
            Comparator.comparing(RoutiePlace::getSequence);

    private final TreeMap<RoutiePlace, Route> routes;

    public Routes(final Map<RoutiePlace, Route> routes) {
        this.routes = new TreeMap<>(Comparator.comparing(RoutiePlace::getSequence));
        this.routes.putAll(routes);
    }

    public static Routes empty() {
        return new Routes(new TreeMap<>(Comparator.comparing(RoutiePlace::getSequence)));
    }

    public Routes withAdded(final RoutiePlace routiePlace, final Route route) {
        Map<RoutiePlace, Route> newRoutes = new TreeMap<>(ROUTE_COMPARATOR);
        newRoutes.putAll(this.routes);
        newRoutes.put(routiePlace, route);

        return new Routes(newRoutes);
    }

    public Route getByRoutiePlace(final RoutiePlace routiePlace) {
        return routes.get(routiePlace);
    }

    public boolean contains(final RoutiePlace routiePlace) {
        return routes.containsKey(routiePlace);
    }

    public List<Route> orderedList() {
        return List.copyOf(routes.values());
    }

    public List<RoutiePlace> orderedRoutiePlaces() {
        if (routes.isEmpty()) {
            return List.of();
        }
        List<RoutiePlace> orderedRoutiePlaces = new ArrayList<>();

        RoutiePlace first = routes.firstKey();
        orderedRoutiePlaces.add(first);

        routes.values().forEach(route -> orderedRoutiePlaces.add(route.to()));

        return List.copyOf(orderedRoutiePlaces);
    }
}
