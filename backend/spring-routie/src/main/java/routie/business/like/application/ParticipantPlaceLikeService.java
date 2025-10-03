package routie.business.like.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import routie.business.authentication.domain.Role;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.Participant;
import routie.business.participant.domain.User;

@Service
@RequiredArgsConstructor
public class ParticipantPlaceLikeService {

    private final UserPlaceLikeService userPlaceLikeService;
    private final GuestPlaceLikeService guestPlaceLikeService;

    public void likePlace(final Long placeId, final String routieSpaceIdentifier, final Participant participant) {
        if (participant.getRole() == Role.USER) {
            userPlaceLikeService.likePlaceV2(placeId, routieSpaceIdentifier, (User) participant);
        }
        if (participant.getRole() == Role.GUEST) {
            guestPlaceLikeService.likePlace(placeId, routieSpaceIdentifier, (Guest) participant);
        }
    }
}
