package routie.business.user.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Getter
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nick_name", nullable = false)
    private String nickName;

    @Column(name = "oauth_identifier", nullable = false)
    private String oAuthIdentifier;

    @Enumerated(EnumType.STRING)
    @Column(name = "oauth_provider", nullable = false)
    private OAuthProvider oAuthProvider;

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private List<RoutieSpace> routieSpaces = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User(
            final String nickName,
            final String oAuthIdentifier,
            final OAuthProvider oAuthProvider
    ) {
        validateName(nickName);
        validateOAuthIdentifier(oAuthIdentifier);
        validateOAuthProvider(oAuthProvider);

        this.nickName = nickName;
        this.oAuthIdentifier = oAuthIdentifier;
        this.oAuthProvider = oAuthProvider;
    }

    public void validateName(final String nickName) {
        if (nickName == null || nickName.isBlank()) {
            throw new BusinessException(ErrorCode.USER_NICKNAME_EMPTY);
        }
        if (nickName.length() > 10) {
            throw new BusinessException(ErrorCode.USER_NICKNAME_LENGTH_INVALID);
        }
    }

    public void validateOAuthIdentifier(final String oAuthIdentifier) {
        if (oAuthIdentifier == null || oAuthIdentifier.isBlank()) {
            throw new BusinessException(ErrorCode.USER_OAUTH_IDENTIFIER_EMPTY);
        }
    }

    public void validateOAuthProvider(final OAuthProvider oAuthProvider) {
        if (oAuthProvider == null) {
            throw new BusinessException(ErrorCode.USER_OAUTH_PROVIDER_EMPTY);
        }
    }
}
