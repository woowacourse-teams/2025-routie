package routie.business.routie.domain;

import java.util.ArrayList;
import java.util.List;

public class RoutieFixture {

    public static List<RoutiePlace> emptyRoutiePlaces() {
        return new ArrayList<>();
    }

    public static Routie emptyRoutie() {
        return new RoutieBuilder()
                .routiePlaces(emptyRoutiePlaces())
                .build();
    }
}
