package routie.routiespace.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import routie.place.domain.Place;
import routie.routie.domain.Routie;

public class RoutieSpaceFixture {

    private static final AtomicLong sequence = new AtomicLong(0L);

    public static String anyIdentifier() {
        return UUID.randomUUID().toString();
    }

    public static String anyName() {
        return "Defualt Routie Space Name" + sequence.incrementAndGet();
    }

    public static Routie emptyRoutie() {
        return Routie.empty();
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
