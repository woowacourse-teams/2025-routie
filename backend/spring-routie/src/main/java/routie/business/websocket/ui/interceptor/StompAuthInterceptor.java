package routie.business.websocket.ui.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.participant.domain.Participant;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompAuthInterceptor implements ChannelInterceptor {

    private final JwtProcessor jwtProcessor;

    @Override
    public Message<?> preSend(final Message<?> message, final MessageChannel channel) {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            final String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                log.warn("STOMP Connect Failed: No Authorization header");
                throw new BusinessException(ErrorCode.AUTHENTICATION_REQUIRED);
            }

            final String token = authorizationHeader.replace("Bearer ", "");
            try {
                final Participant participant = jwtProcessor.parseParticipant(token);
                if (accessor.getSessionAttributes() != null) {
                    accessor.getSessionAttributes().put("participant", participant);
                }
            } catch (final Exception e) {
                log.warn("STOMP Connect Failed: Invalid Token", e);
                throw new BusinessException(ErrorCode.AUTHENTICATION_REQUIRED);
            }
        }
        return message;
    }
}
