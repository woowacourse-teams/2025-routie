package routie.business.like.domain;

import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestFixture;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceFixture;

public class PlaceLikeBuilder {

    private Place place = PlaceFixture.anyPlace();
    private User user = UserFixture.emptyUser();
    private Guest guest = GuestFixture.emptyGuest();

    public PlaceLikeBuilder place(final Place place) {
        this.place = place;
        return this;
    }

    public PlaceLikeBuilder user(final User user) {
        this.user = user;
        return this;
    }

    public PlaceLikeBuilder guest(final Guest guest) {
        this.guest = guest;
        return this;
    }

    public PlaceLike build() {
        return new PlaceLike(place, user, guest);
    }
}
