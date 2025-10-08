package routie.business.participant.domain;

import routie.business.routiespace.domain.RoutieSpace;

public class GuestBuilder {

    private String nickname = GuestFixture.anyNickname();
    private String password = GuestFixture.anyPassword();
    private RoutieSpace routieSpace = GuestFixture.emptyRoutieSpace();

    public GuestBuilder nickname(final String nickname) {
        this.nickname = nickname;
        return this;
    }

    public GuestBuilder password(final String password) {
        this.password = password;
        return this;
    }

    public GuestBuilder routieSpace(final RoutieSpace routieSpace) {
        this.routieSpace = routieSpace;
        return this;
    }

    public Guest build() {
        return new Guest(
                null,
                nickname,
                password,
                routieSpace,
                null,
                null
        );
    }
}
