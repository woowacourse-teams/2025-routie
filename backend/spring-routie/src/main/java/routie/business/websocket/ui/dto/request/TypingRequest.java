package routie.business.websocket.ui.dto.request;

public record TypingRequest(
        Long routieSpaceId,
        Boolean isTyping
) {
}
