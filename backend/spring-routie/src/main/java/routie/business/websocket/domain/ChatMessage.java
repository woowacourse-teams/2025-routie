package routie.business.websocket.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.User;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(
        name = "chat_messages", indexes = {
        @Index(name = "idx_chat_messages_space_time", columnList = "routie_space_id, created_at")
}
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routie_space_id", nullable = false)
    private RoutieSpace routieSpace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, length = 20)
    private MessageType messageType;

    @Column(length = 1000)
    private String content;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private ChatMessage(
            final RoutieSpace routieSpace, final User user, final Guest guest,
            final MessageType messageType, final String content
    ) {
        validateSpace(routieSpace);
        validateSender(user, guest);
        validateContent(content);

        this.routieSpace = routieSpace;
        this.user = user;
        this.guest = guest;
        this.messageType = messageType;
        this.content = content;
    }

    public static ChatMessage createByUser(
            final RoutieSpace routieSpace, final User user,
            final MessageType messageType, final String content
    ) {
        return new ChatMessage(routieSpace, user, null, messageType, content);
    }

    public static ChatMessage createByGuest(
            final RoutieSpace routieSpace, final Guest guest,
            final MessageType messageType, final String content
    ) {
        return new ChatMessage(routieSpace, null, guest, messageType, content);
    }

    public static ChatMessage createSystemMessage(
            final RoutieSpace routieSpace,
            final MessageType messageType, final String content
    ) {
        return new ChatMessage(routieSpace, null, null, messageType, content);
    }

    private void validateSpace(final RoutieSpace routieSpace) {
        if (routieSpace == null) {
            throw new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND);
        }
    }

    private void validateSender(final User user, final Guest guest) {
        if (user != null && guest != null) {
            throw new BusinessException(ErrorCode.CHAT_SENDER_DUPLICATED);
        }
    }

    private void validateContent(final String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.CHAT_CONTENT_EMPTY);
        }
        if (content.length() > 1000) {
            throw new BusinessException(ErrorCode.CHAT_CONTENT_TOO_LONG);
        }
    }
}
