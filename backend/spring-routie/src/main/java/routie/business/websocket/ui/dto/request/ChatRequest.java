package routie.business.websocket.ui.dto.request;

import routie.business.websocket.domain.MessageType;

public record ChatRequest(
        String tempId,
        MessageType type,
        String content
) {
}
