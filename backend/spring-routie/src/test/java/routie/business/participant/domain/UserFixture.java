package routie.business.participant.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.routiespace.domain.RoutieSpace;

public class UserFixture {

    private static final AtomicLong sequence = new AtomicLong(0L);

    public static String anyNickName() {
        return UUID.randomUUID().toString().substring(0, 7);
    }

    public static String anyExternalAuthenticationIdentifier() {
        return UUID.randomUUID().toString().substring(0, 7);
    }

    public static ExternalAuthenticationProvider anyExternalAuthenticationProvider() {
        return ExternalAuthenticationProvider.KAKAO;
    }

    public static List<RoutieSpace> emptyRoutieSpaces() {
        return new ArrayList<>();
    }

    public static User emptyUser() {
        return new UserBuilder()
                .nickName(anyNickName())
                .externalAuthenticationIdentifier(anyExternalAuthenticationIdentifier())
                .externalAuthenticationProvider(anyExternalAuthenticationProvider())
                .routieSpaces(emptyRoutieSpaces())
                .build();
    }
}
