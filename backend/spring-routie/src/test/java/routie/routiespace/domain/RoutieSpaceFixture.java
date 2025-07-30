package routie.routiespace.domain;

import java.util.List;
import routie.place.domain.Place;
import routie.routie.domain.Routie;

public class RoutieSpaceFixture {

    public static RoutieSpace createWithoutId(final List<Place> places, final List<Routie> routies) {
        return new RoutieSpace(null, "test-space", "test-identifier", places, routies, null, null);
    }
}
