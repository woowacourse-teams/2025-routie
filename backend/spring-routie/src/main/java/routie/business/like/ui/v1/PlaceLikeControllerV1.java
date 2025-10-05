package routie.business.like.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.like.application.ParticipantPlaceLikeService;
import routie.business.like.application.UserPlaceLikeService;
import routie.business.participant.domain.Participant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/routie-spaces/{routieSpaceIdentifier}/places/{placeId}")
public class PlaceLikeControllerV1 {

    private final UserPlaceLikeService userPlaceLikeService;
    private final ParticipantPlaceLikeService participantPlaceLikeService;

    @Deprecated
    @PostMapping("/likes")
    public ResponseEntity<Void> like(
            @PathVariable final Long placeId,
            @PathVariable final String routieSpaceIdentifier
    ) {
        userPlaceLikeService.likePlace(placeId, routieSpaceIdentifier);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/likes")
    public ResponseEntity<Void> deleteLike(
            @PathVariable final Long placeId,
            @PathVariable final String routieSpaceIdentifier,
            @AuthenticatedParticipant final Participant participant
    ) {
        participantPlaceLikeService.removePlaceLike(placeId, routieSpaceIdentifier, participant);
        return ResponseEntity.ok().build();
    }
}
