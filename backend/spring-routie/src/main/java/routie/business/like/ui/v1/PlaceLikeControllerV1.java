package routie.business.like.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.like.application.UserPlaceLikeService;
import routie.business.participant.domain.Participant;
import routie.business.participant.domain.User;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/routie-spaces/{routieSpaceIdentifier}/places/{placeId}")
public class PlaceLikeControllerV1 {

    private final UserPlaceLikeService userPlaceLikeService;

    @Deprecated
    @PostMapping("/likes")
    public ResponseEntity<Void> like(
            @PathVariable final Long placeId,
            @PathVariable final String routieSpaceIdentifier,
            @AuthenticatedParticipant final Participant participant
    ) {
        userPlaceLikeService.likePlace(placeId, routieSpaceIdentifier, (User) participant);
        return ResponseEntity.ok().build();
    }
}
