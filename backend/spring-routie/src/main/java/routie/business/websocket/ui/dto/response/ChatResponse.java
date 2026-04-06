package routie.business.websocket.ui.dto.response;

import java.time.LocalDateTime;

public record ChatResponse(
        String type,
        String messageId,
        String tempId,
        Long senderId,
        String senderRole,
        String senderName,
        String content,
        LocalDateTime timestamp
) {
}
