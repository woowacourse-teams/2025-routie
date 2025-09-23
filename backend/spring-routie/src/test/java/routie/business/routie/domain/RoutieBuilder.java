package routie.business.routie.domain;

import java.util.List;

public class RoutieBuilder {

    private List<RoutiePlace> routiePlaces = RoutieFixture.emptyRoutiePlaces();

    public RoutieBuilder routiePlaces(final List<RoutiePlace> routiePlaces) {
        this.routiePlaces = routiePlaces;
        return this;
    }

    public Routie build() {
        return Routie.create(
                routiePlaces
        );
    }
}
