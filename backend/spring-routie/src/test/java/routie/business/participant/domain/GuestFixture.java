package routie.business.participant.domain;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceFixture;

public class GuestFixture {

    private static final AtomicLong sequence = new AtomicLong(0L);

    public static String anyNickname() {
        return UUID.randomUUID().toString().substring(0, 7);
    }

    public static String anyPassword() {
        return UUID.randomUUID().toString().substring(0, 7);
    }

    public static RoutieSpace anyRoutieSpace() {
        return RoutieSpaceFixture.emptyRoutieSpace();
    }

    public static Guest emptyGuest() {
        return new GuestBuilder()
                .nickname(anyNickname())
                .password(anyPassword())
                .routieSpace(anyRoutieSpace())
                .build();
    }
}
