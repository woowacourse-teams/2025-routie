package routie.business.websocket.ui.dto.response;

import java.util.List;

import routie.business.websocket.domain.MessageType;

public record PresenceResponse(
        MessageType type,
        List<ActiveUser> activeUsers,
        String timestamp
) {
}
