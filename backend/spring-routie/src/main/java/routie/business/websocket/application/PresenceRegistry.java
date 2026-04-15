package routie.business.websocket.application;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import routie.business.websocket.ui.dto.response.ActiveUser;

@Component
public class PresenceRegistry {

    private final Map<Long, Map<Long, ActiveUser>> roomToUsers = new ConcurrentHashMap<>();
    private final Map<String, SubscriptionKey> subscriptionKeyBySessionSub = new ConcurrentHashMap<>();

    public void addSubscription(
            final String sessionId,
            final String subscriptionId,
            final Long routieSpaceId,
            final ActiveUser user
    ) {
        subscriptionKeyBySessionSub.put(
                compositeKey(sessionId, subscriptionId),
                new SubscriptionKey(routieSpaceId, user.userId())
        );
        roomToUsers
                .computeIfAbsent(routieSpaceId, id -> new ConcurrentHashMap<>())
                .put(user.userId(), user);
    }

    public Optional<SubscriptionKey> removeSubscription(final String sessionId, final String subscriptionId) {
        final SubscriptionKey key = subscriptionKeyBySessionSub.remove(compositeKey(sessionId, subscriptionId));
        if (key == null) {
            return Optional.empty();
        }
        removeUserFromRoom(key.routieSpaceId(), key.participantId());
        return Optional.of(key);
    }

    public List<SubscriptionKey> removeAllForSession(final String sessionId) {
        final String prefix = sessionId + "|";
        final List<SubscriptionKey> removed = new ArrayList<>();
        subscriptionKeyBySessionSub.entrySet().removeIf(entry -> {
            if (entry.getKey().startsWith(prefix)) {
                removed.add(entry.getValue());
                return true;
            }
            return false;
        });
        for (final SubscriptionKey key : removed) {
            removeUserFromRoom(key.routieSpaceId(), key.participantId());
        }
        return removed;
    }

    public List<ActiveUser> snapshot(final Long routieSpaceId) {
        final Map<Long, ActiveUser> users = roomToUsers.get(routieSpaceId);
        if (users == null) {
            return Collections.emptyList();
        }
        return new ArrayList<>(users.values());
    }

    private void removeUserFromRoom(final Long routieSpaceId, final Long participantId) {
        final Map<Long, ActiveUser> users = roomToUsers.get(routieSpaceId);
        if (users == null) {
            return;
        }
        users.remove(participantId);
        if (users.isEmpty()) {
            roomToUsers.remove(routieSpaceId);
        }
    }

    private String compositeKey(final String sessionId, final String subscriptionId) {
        return sessionId + "|" + subscriptionId;
    }

    public record SubscriptionKey(Long routieSpaceId, Long participantId) {
    }
}
