package routie.business.like.domain;

import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestFixture;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceFixture;

public class PlaceLikeFixture {

    public static PlaceLike anyPlaceLike() {
        return new PlaceLikeBuilder()
                .place(PlaceFixture.anyPlace())
                .user(null)
                .guest(null)
                .build();
    }

    public static User emptyUser() {
        return UserFixture.emptyUser();
    }

    public static Guest emptyGuest() {
        return GuestFixture.emptyGuest();
    }

    public static PlaceLike placeLikeForPlaceAndUser(final Place place, final User user) {
        return new PlaceLikeBuilder()
                .place(place)
                .user(user)
                .guest(null)
                .build();
    }

    public static PlaceLike placeLikeForPlaceAndGuest(final Place place, final Guest guest) {
        return new PlaceLikeBuilder()
                .place(place)
                .user(null)
                .guest(guest)
                .build();
    }
}
