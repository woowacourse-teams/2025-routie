package routie.business.websocket.ui.listener;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import routie.business.participant.domain.Participant;
import routie.business.websocket.application.PresenceRegistry;
import routie.business.websocket.application.PresenceRegistry.SubscriptionKey;
import routie.business.websocket.domain.MessageType;
import routie.business.websocket.ui.dto.response.ActiveUser;
import routie.business.websocket.ui.dto.response.PresenceResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class PresenceEventListener {

    private static final Pattern CHAT_ROOM_DESTINATION = Pattern.compile("^/topic/chat/room/(\\d+)$");
    private static final String PARTICIPANT_SESSION_ATTRIBUTE = "participant";

    private final PresenceRegistry presenceRegistry;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void onSubscribe(final SessionSubscribeEvent event) {
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        final Long routieSpaceId = extractRoutieSpaceId(accessor.getDestination());
        if (routieSpaceId == null) {
            return;
        }

        final Participant participant = getParticipant(accessor);
        if (participant == null) {
            log.warn("구독 이벤트에 participant 정보가 없습니다. sessionId: {}", accessor.getSessionId());
            return;
        }

        final ActiveUser user = new ActiveUser(
                participant.getId(),
                participant.getNickname(),
                participant.getRole().name()
        );
        presenceRegistry.addSubscription(
                accessor.getSessionId(),
                accessor.getSubscriptionId(),
                routieSpaceId,
                user
        );
        broadcastPresence(routieSpaceId);
    }

    @EventListener
    public void onUnsubscribe(final SessionUnsubscribeEvent event) {
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        presenceRegistry.removeSubscription(accessor.getSessionId(), accessor.getSubscriptionId())
                .ifPresent(key -> broadcastPresence(key.routieSpaceId()));
    }

    @EventListener
    public void onDisconnect(final SessionDisconnectEvent event) {
        final List<SubscriptionKey> removed = presenceRegistry.removeAllForSession(event.getSessionId());
        final Set<Long> affectedRooms = new HashSet<>();
        for (final SubscriptionKey key : removed) {
            affectedRooms.add(key.routieSpaceId());
        }
        for (final Long routieSpaceId : affectedRooms) {
            broadcastPresence(routieSpaceId);
        }
    }

    private void broadcastPresence(final Long routieSpaceId) {
        final PresenceResponse response = new PresenceResponse(
                MessageType.PRESENCE,
                presenceRegistry.snapshot(routieSpaceId),
                Instant.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/chat/room/" + routieSpaceId, response);
    }

    private Long extractRoutieSpaceId(final String destination) {
        if (destination == null) {
            return null;
        }
        final Matcher matcher = CHAT_ROOM_DESTINATION.matcher(destination);
        if (!matcher.matches()) {
            return null;
        }
        return Long.parseLong(matcher.group(1));
    }

    private Participant getParticipant(final StompHeaderAccessor accessor) {
        final Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        if (sessionAttributes == null) {
            return null;
        }
        final Object value = sessionAttributes.get(PARTICIPANT_SESSION_ATTRIBUTE);
        if (value instanceof Participant participant) {
            return participant;
        }
        return null;
    }
}
