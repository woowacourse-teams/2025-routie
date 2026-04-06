package routie.business.websocket.ui.v1;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.participant.domain.Participant;
import routie.business.websocket.application.ChatService;
import routie.business.websocket.domain.ChatMessage;
import routie.business.websocket.ui.dto.request.ChatRequest;
import routie.business.websocket.ui.dto.response.ChatResponse;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatControllerV1 {

    private final ChatService chatService;

    @MessageMapping("/chat/room/{routieSpaceId}")
    @SendTo("/topic/chat/room/{routieSpaceId}")
    public ChatResponse sendMessage(
            @DestinationVariable("routieSpaceId") final Long routieSpaceId,
            @AuthenticatedParticipant final Participant participant,
            @Payload final ChatRequest request
    ) {

        log.info("새로운 채팅 도착! Space ID: {}, Temp ID: {}, Content: {}",
                routieSpaceId, request.tempId(), request.content());

        final ChatMessage savedMessage = chatService.saveChatMessage(routieSpaceId, participant, request);

        final String senderName = participant.getNickname();
        final String senderRole = participant.getRole().name();

        return new ChatResponse(
                savedMessage.getMessageType().name(),
                String.valueOf(savedMessage.getId()),
                request.tempId(),
                participant.getId(),
                senderRole,
                senderName,
                savedMessage.getContent(),
                savedMessage.getCreatedAt()
        );
    }
}
