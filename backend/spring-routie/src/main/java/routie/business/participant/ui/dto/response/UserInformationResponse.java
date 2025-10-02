package routie.business.participant.ui.dto.response;

import routie.business.participant.domain.User;

public record UserInformationResponse(
        String nickName
) {

    public static UserInformationResponse from(final User user) {
        return new UserInformationResponse(user.getNickname());
    }
}
