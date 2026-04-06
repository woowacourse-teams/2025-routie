package routie.business.websocket.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.authentication.domain.Role;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.Participant;
import routie.business.participant.domain.User;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.websocket.domain.ChatMessage;
import routie.business.websocket.domain.ChatMessageRepository;
import routie.business.websocket.ui.dto.request.ChatRequest;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RoutieSpaceRepository routieSpaceRepository;

    @Transactional
    public ChatMessage saveChatMessage(
            final Long routieSpaceId,
            final Participant participant,
            final ChatRequest request
    ) {
        final RoutieSpace routieSpace = routieSpaceRepository.findById(routieSpaceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));

        if (participant.getRole() == Role.USER) {
            final ChatMessage message = ChatMessage.createByUser(
                    routieSpace, (User) participant, request.type(), request.content()
            );
            return chatMessageRepository.save(message);
        }

        if (participant.getRole() == Role.GUEST) {
            final ChatMessage message = ChatMessage.createByGuest(
                    routieSpace, (Guest) participant, request.type(), request.content()
            );
            return chatMessageRepository.save(message);
        }

        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    }
}
