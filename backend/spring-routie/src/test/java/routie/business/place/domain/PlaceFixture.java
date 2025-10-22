package routie.business.place.domain;

import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceFixture;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class PlaceFixture {

    public static AtomicLong sequence = new AtomicLong(0L);

    public static String anyName() {
        return "Default Place Name" + sequence.incrementAndGet();
    }

    public static String anyRoadAddressName() {
        return "Default Road Address Name" + sequence.incrementAndGet();
    }

    public static String anyAddressName() {
        return "Default Address Name" + sequence.incrementAndGet();
    }

    public static Double anyLongitude() {
        return 127.0;
    }

    public static Double anyLatitude() {
        return 37.504497373023206;
    }

    public static String anyKakaoPlaceId() {
        return "100000";
    }

    public static int anyStayDurationMinutes() {
        return 60;
    }

    public static LocalTime anyOpenAt() {
        return LocalTime.of(0, 0);
    }

    public static LocalTime anyCloseAt() {
        return LocalTime.of(23, 59);
    }

    public static LocalTime anyBreakStartAt() {
        return LocalTime.of(23, 59);
    }

    public static LocalTime anyBreakEndAt() {
        return LocalTime.of(23, 59);
    }

    public static RoutieSpace anyRoutieSpace() {
        return RoutieSpaceFixture.emptyRoutieSpace();
    }

    public static List<PlaceClosedDayOfWeek> anyPlaceClosedDayOfWeeks() {
        return new ArrayList<>();
    }

    public static Place anyPlace() {
        return new PlaceBuilder()
                .build();
    }
}
