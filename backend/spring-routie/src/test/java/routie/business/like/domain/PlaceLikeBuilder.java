package routie.business.like.domain;

import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceFixture;

public class PlaceLikeBuilder {

    private Place place = PlaceFixture.anyPlace();

    public PlaceLikeBuilder place(final Place place) {
        this.place = place;
        return this;
    }

    public PlaceLike build() {
        return new PlaceLike(place);
    }
}
