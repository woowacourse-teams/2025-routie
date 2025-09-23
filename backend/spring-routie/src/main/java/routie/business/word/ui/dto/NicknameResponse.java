package routie.business.word.ui.dto;

public record NicknameResponse(
        String nickname
) {
    public static NicknameResponse from(final String nickname) {
        return new NicknameResponse(nickname);
    }
}
