package routie.business.like.ui.v2;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.like.application.ParticipantPlaceLikeService;
import routie.business.participant.domain.Participant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v2/routie-spaces/{routieSpaceIdentifier}/places/{placeId}")
public class PlaceLikeControllerV2 {

    private final ParticipantPlaceLikeService participantPlaceLikeService;

    @PostMapping("/likes")
    public ResponseEntity<Void> createPlaceLike(
            @PathVariable final Long placeId,
            @PathVariable final String routieSpaceIdentifier,
            @AuthenticatedParticipant final Participant participant
    ) {
        participantPlaceLikeService.addPlaceLike(placeId, routieSpaceIdentifier, participant);
        return ResponseEntity.ok().build();
    }
}
