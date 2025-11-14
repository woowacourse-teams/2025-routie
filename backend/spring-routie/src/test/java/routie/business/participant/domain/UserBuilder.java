package routie.business.participant.domain;

import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.routiespace.domain.RoutieSpace;

import java.util.List;

public class UserBuilder {

    private String nickname = UserFixture.anyNickname();
    private String externalAuthenticationIdentifier = UserFixture.anyExternalAuthenticationIdentifier();
    private ExternalAuthenticationProvider externalAuthenticationProvider = UserFixture
            .anyExternalAuthenticationProvider();
    private List<RoutieSpace> routieSpaces = UserFixture.emptyRoutieSpaces();

    public UserBuilder nickname(final String nickname) {
        this.nickname = nickname;
        return this;
    }

    public UserBuilder externalAuthenticationIdentifier(final String externalAuthenticationIdentifier) {
        this.externalAuthenticationIdentifier = externalAuthenticationIdentifier;
        return this;
    }

    public UserBuilder externalAuthenticationProvider(
            final ExternalAuthenticationProvider externalAuthenticationProvider
    ) {
        this.externalAuthenticationProvider = externalAuthenticationProvider;
        return this;
    }

    public UserBuilder routieSpaces(final List<RoutieSpace> routieSpaces) {
        this.routieSpaces = routieSpaces;
        return this;
    }

    public User build() {
        return new User(
                null,
                nickname,
                externalAuthenticationIdentifier,
                externalAuthenticationProvider,
                routieSpaces,
                null,
                null
        );
    }
}
