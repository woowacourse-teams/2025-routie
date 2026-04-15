package routie.business.websocket.ui.dto.response;

import routie.business.websocket.domain.MessageType;

public record TypingResponse(
        MessageType type,
        Long senderId,
        String senderName,
        String senderRole,
        Boolean isTyping,
        String timestamp
) {
}
