package routie.business.routiespace.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import routie.business.place.domain.Place;
import routie.business.routie.domain.Routie;
import routie.business.routie.domain.RoutieFixture;

public class RoutieSpaceFixture {

    private static final AtomicLong sequence = new AtomicLong(0L);

    public static String anyIdentifier() {
        return UUID.randomUUID().toString();
    }

    public static String anyName() {
        return "Defualt Routie Space Name" + sequence.incrementAndGet();
    }

    public static Routie emptyRoutie() {
        return RoutieFixture.emptyRoutie();
    }

    public static List<Place> emptyPlaces() {
        return new ArrayList<>();
    }

    public static RoutieSpace emptyRoutieSpace() {
        return new RoutieSpaceBuilder()
                .places(emptyPlaces())
                .routie(emptyRoutie())
                .build();
    }
}
