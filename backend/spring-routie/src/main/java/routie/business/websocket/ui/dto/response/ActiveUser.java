package routie.business.websocket.ui.dto.response;

public record ActiveUser(
        Long userId,
        String userName,
        String userRole
) {
}
