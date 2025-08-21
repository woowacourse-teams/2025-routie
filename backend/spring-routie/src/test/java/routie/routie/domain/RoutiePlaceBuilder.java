package routie.routie.domain;

import routie.place.domain.Place;

public class RoutiePlaceBuilder {

    private int sequence;
    private Place place;

    public RoutiePlaceBuilder sequence(final int sequence) {
        this.sequence = sequence;
        return this;
    }

    public RoutiePlaceBuilder place(final Place place) {
        this.place = place;
        return this;
    }

    public RoutiePlace build() {
        return new RoutiePlace(
                sequence,
                place
        );
    }
}	
