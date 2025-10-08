package routie.business.participant.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import routie.business.authentication.domain.Role;
import routie.business.like.domain.PlaceLike;
import routie.business.place.domain.Place;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Getter
@Entity
@Table(name = "guests")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Guest implements Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "password")
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routie_space_id", nullable = false)
    private RoutieSpace routieSpace;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Guest(
            final String nickname,
            final String password,
            final RoutieSpace routieSpace
    ) {
        validateNickname(nickname);
        this.nickname = nickname;
        this.password = password;
        this.routieSpace = routieSpace;
    }

    public static Guest createEncoded(
            final String nickname,
            final String rawPassword,
            final RoutieSpace routieSpace,
            final PasswordEncoder passwordEncoder
    ) {
        final String encodedPassword = passwordEncoder.encode(rawPassword);
        return new Guest(nickname, encodedPassword, routieSpace);
    }

    private void validateNickname(final String nickname) {
        if (nickname == null || nickname.isBlank()) {
            throw new BusinessException(ErrorCode.GUEST_NICKNAME_EMPTY);
        }
        if (nickname.length() > 10) {
            throw new BusinessException(ErrorCode.GUEST_NICKNAME_LENGTH_INVALID);
        }
    }

    public boolean matchesPassword(final String rawPassword, final PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(rawPassword, this.password);
    }

    @Override
    public Role getRole() {
        return Role.GUEST;
    }

    @Override
    public PlaceLike likePlace(final Place place) {
        return new PlaceLike(place, null, this);
    }
}
