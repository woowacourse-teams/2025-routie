package routie.routiespace.domain;

import java.util.List;
import routie.place.domain.Place;
import routie.routie.domain.Routie;

public class RoutieSpaceBuilder {

    private String name = RoutieSpaceFixture.anyName();
    private String identifier = RoutieSpaceFixture.anyIdentifier();
    private List<Place> places = RoutieSpaceFixture.emptyPlaces();
    private Routie routie = RoutieSpaceFixture.emptyRoutie();

    public RoutieSpaceBuilder name(final String name) {
        this.name = name;
        return this;
    }

    public RoutieSpaceBuilder identifier(final String identifier) {
        this.identifier = identifier;
        return this;
    }

    public RoutieSpaceBuilder places(final List<Place> places) {
        this.places = places;
        return this;
    }

    public RoutieSpaceBuilder routie(final Routie routie) {
        this.routie = routie;
        return this;
    }

    public RoutieSpace build() {
        return new RoutieSpace(
                null,
                name,
                identifier,
                places,
                routie,
                null,
                null
        );
    }
}
