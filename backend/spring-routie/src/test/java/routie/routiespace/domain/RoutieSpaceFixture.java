package routie.routiespace.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import routie.place.domain.Place;
import routie.routie.domain.Routie;

public class RoutieSpaceFixture {

    public static RoutieSpace createWithoutId(final List<Place> places, final Routie routie) {
        return new RoutieSpace(null, "test-space", UUID.randomUUID().toString(), places, routie, null, null);
    }

    public static RoutieSpace createEmpty() {
        return createWithoutId(new ArrayList<>(), Routie.empty());
    }
}
