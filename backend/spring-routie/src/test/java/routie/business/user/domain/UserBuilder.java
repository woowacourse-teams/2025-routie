package routie.business.user.domain;

import java.util.List;
import routie.business.routiespace.domain.RoutieSpace;

public class UserBuilder {

    private String nickName = UserFixture.anyNickName();
    private String oAuthIdentifier = UserFixture.anyOAuthIdentifier();
    private OAuthProvider oAuthProvider = UserFixture.anyOAuthProvider();
    private List<RoutieSpace> routieSpaces = UserFixture.emptyRoutieSpaces();

    public UserBuilder nickName(final String nickName) {
        this.nickName = nickName;
        return this;
    }

    public UserBuilder oAuthIdentifier(final String oAuthIdentifier) {
        this.oAuthIdentifier = oAuthIdentifier;
        return this;
    }

    public UserBuilder oAuthProvider(final OAuthProvider oAuthProvider) {
        this.oAuthProvider = oAuthProvider;
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
                oAuthIdentifier,
                oAuthProvider,
                routieSpaces,
                null,
                null
        );
    }
}
