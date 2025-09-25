package routie.business.user.ui.dto.response;

import routie.business.user.domain.User;

public record UserInformationResponse(
        String nickName
) {

    public static UserInformationResponse from(final User user) {
        return new UserInformationResponse(user.getNickName());
    }
}
