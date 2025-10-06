package routie.business.participant.domain;

import routie.business.authentication.domain.Role;
import routie.business.like.domain.PlaceLike;
import routie.business.place.domain.Place;

public interface Participant {
    Long getId();

    String getNickname();

    Role getRole();

    PlaceLike likePlace(Place place);
}
