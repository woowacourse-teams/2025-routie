package routie.business.participant.ui.dto.response;

import routie.business.authentication.domain.Role;
import routie.business.participant.domain.Participant;

public record ParticipantInformationResponse(
        Role role,
        String nickname
) {

    public static ParticipantInformationResponse from(final Participant participant) {
        return new ParticipantInformationResponse(participant.getRole(), participant.getNickname());
    }
}
