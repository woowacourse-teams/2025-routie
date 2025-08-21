package routie.routie.domain.route;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.routie.domain.RoutiePlace;

public class Routes {
    private static final Comparator<RoutiePlace> ROUTE_COMPARATOR =
            Comparator.comparing(RoutiePlace::getSequence);

    private final TreeMap<RoutiePlace, Route> routes;

    public Routes(final Map<RoutiePlace, Route> routes) {
        validateRoutes(routes);
        this.routes = new TreeMap<>(ROUTE_COMPARATOR);
        this.routes.putAll(routes);
    }

    public static Routes empty() {
        return new Routes(new TreeMap<>(ROUTE_COMPARATOR));
    }

    private void validateRoutes(final Map<RoutiePlace, Route> routes) {
        if (routes == null) {
            throw new BusinessException(ErrorCode.ROUTES_NULL);
        }
    }

    public Routes withAdded(final RoutiePlace routiePlace, final Route route) {
        validateRoutiePlace(routiePlace);
        validateRoute(route);
        Map<RoutiePlace, Route> newRoutes = new TreeMap<>(ROUTE_COMPARATOR);
        newRoutes.putAll(this.routes);
        newRoutes.put(routiePlace, route);

        return new Routes(newRoutes);
    }

    public Route getByRoutiePlace(final RoutiePlace routiePlace) {
        validateRoutiePlace(routiePlace);
        return routes.get(routiePlace);
    }

    public boolean contains(final RoutiePlace routiePlace) {
        validateRoutiePlace(routiePlace);
        return routes.containsKey(routiePlace);
    }

    private void validateRoutiePlace(final RoutiePlace routiePlace) {
        if (routiePlace == null) {
            throw new BusinessException(ErrorCode.ROUTIE_PLACE_NULL);
        }
    }

    private void validateRoute(final Route route) {
        if (route == null) {
            throw new BusinessException(ErrorCode.ROUTE_NULL);
        }
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

    public boolean isEmpty() {
        return routes.isEmpty();
    }
}
