package routie.business.placelike.domain;

import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceFixture;

public class PlaceLikeFixture {

    public static PlaceLike anyPlaceLike() {
        return new PlaceLikeBuilder()
                .place(PlaceFixture.anyPlace())
                .build();
    }

    public static PlaceLike placeLikeForPlace(final Place place) {
        return new PlaceLikeBuilder()
                .place(place)
                .build();
    }
}
