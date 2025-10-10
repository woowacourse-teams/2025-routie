package routie.business.like.application;

import routie.business.authentication.domain.Role;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.Participant;

public interface PlaceLikeService<T extends Participant> {

    void likePlace(Long placeId, String routieSpaceIdentifier, T participant);

    void removePlaceLike(Long placeId, String routieSpaceIdentifier, T participant);

    LikedPlacesResponse getLikedPlaces(String routieSpaceIdentifier, T participant);

    Role getRole();
}
