package routie.business.participant.domain;

import java.util.List;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.routiespace.domain.RoutieSpace;

public class UserBuilder {

    private String nickName = UserFixture.anyNickName();
    private String externalAuthenticationIdentifier = UserFixture.anyExternalAuthenticationIdentifier();
    private ExternalAuthenticationProvider externalAuthenticationProvider = UserFixture.anyExternalAuthenticationProvider();
    private List<RoutieSpace> routieSpaces = UserFixture.emptyRoutieSpaces();

    public UserBuilder nickName(final String nickName) {
        this.nickName = nickName;
        return this;
    }

    public UserBuilder externalAuthenticationIdentifier(final String externalAuthenticationIdentifier) {
        this.externalAuthenticationIdentifier = externalAuthenticationIdentifier;
        return this;
    }

    public UserBuilder externalAuthenticationProvider(
            final ExternalAuthenticationProvider externalAuthenticationProvider) {
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
                nickName,
                externalAuthenticationIdentifier,
                externalAuthenticationProvider,
                routieSpaces,
                null,
                null
        );
    }
}
