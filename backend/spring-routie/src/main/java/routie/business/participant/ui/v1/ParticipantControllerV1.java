package routie.business.participant.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.participant.domain.Participant;
import routie.business.participant.ui.dto.response.ParticipantInformationResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/participants")
public class ParticipantControllerV1 {

    @GetMapping("/me")
    public ResponseEntity<ParticipantInformationResponse> getMyInformation(
            @AuthenticatedParticipant final Participant participant
    ) {
        return ResponseEntity.ok(ParticipantInformationResponse.from(participant));
    }
}
