package routie.business.authentication.ui.argument.resolver.websocket;

import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import routie.business.authentication.domain.Role;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.participant.domain.Participant;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

import java.util.Arrays;
import java.util.Optional;

@Component
public class WebSocketAuthenticatedParticipantArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticatedParticipant.class) &&
                Participant.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(
            final MethodParameter parameter,
            final Message<?> message
    ) {
        final StompHeaderAccessor accessor = getAccessor(message);
        final Participant participant = getParticipant(accessor);
        final AuthenticatedParticipant annotation = parameter.getParameterAnnotation(AuthenticatedParticipant.class);
        final Role[] requiredRoles = annotation.roles();

        if (requiredRoles.length > 0) {
            final Role participantRole = participant.getRole();
            final boolean isAuthorized = Arrays.asList(requiredRoles).contains(participantRole);

            if (!isAuthorized) {
                throw new BusinessException(ErrorCode.FORBIDDEN);
            }
        }

        return participant;
    }

    private StompHeaderAccessor getAccessor(final Message<?> message) {
        return Optional.ofNullable(MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class))
                .orElseThrow(() -> new BusinessException(ErrorCode.UNEXPECTED_EXCEPTION));
    }

    private Participant getParticipant(final StompHeaderAccessor accessor) {
        return Optional.ofNullable(accessor.getSessionAttributes())
                .map(attributes -> attributes.get("participant"))
                .filter(obj -> obj instanceof Participant)
                .map(obj -> (Participant) obj)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTHENTICATION_REQUIRED));
    }
}
