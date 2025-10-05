package routie.business.participant.domain;

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
import jakarta.persistence.UniqueConstraint;
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
import routie.business.authentication.domain.Role;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Getter
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_external_authentication_identifier_provider",
                        columnNames = {"external_authentication_identifier", "external_authentication_provider"}
                )
        }

)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "external_authentication_identifier", nullable = false)
    private String externalAuthenticationIdentifier;

    @Enumerated(EnumType.STRING)
    @Column(name = "external_authentication_provider", nullable = false)
    private ExternalAuthenticationProvider externalAuthenticationProvider;

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private List<RoutieSpace> routieSpaces = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User(
            final String nickname,
            final String externalAuthenticationIdentifier,
            final ExternalAuthenticationProvider externalAuthenticationProvider
    ) {
        validateNickname(nickname);
        validateExternalAuthenticationIdentifier(externalAuthenticationIdentifier);
        validateExternalAuthenticationProvider(externalAuthenticationProvider);

        this.nickname = nickname;
        this.externalAuthenticationIdentifier = externalAuthenticationIdentifier;
        this.externalAuthenticationProvider = externalAuthenticationProvider;
    }

    public void validateNickname(final String nickname) {
        if (nickname == null || nickname.isBlank()) {
            throw new BusinessException(ErrorCode.USER_NICKNAME_EMPTY);
        }
        if (nickname.length() > 10) {
            throw new BusinessException(ErrorCode.USER_NICKNAME_LENGTH_INVALID);
        }
    }

    public void validateExternalAuthenticationIdentifier(final String externalAuthenticationIdentifier) {
        if (externalAuthenticationIdentifier == null || externalAuthenticationIdentifier.isBlank()) {
            throw new BusinessException(ErrorCode.USER_OAUTH_IDENTIFIER_EMPTY);
        }
    }

    public void validateExternalAuthenticationProvider(
            final ExternalAuthenticationProvider externalAuthenticationProvider) {
        if (externalAuthenticationProvider == null) {
            throw new BusinessException(ErrorCode.USER_OAUTH_PROVIDER_EMPTY);
        }
    }

    @Override
    public String getNickname() {
        return nickname;
    }

    @Override
    public Role getRole() {
        return Role.USER;
    }
}
