package routie.place.domain;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import routie.routiespace.domain.RoutieSpace;

public class PlaceBuilder {

    private String name = PlaceFixture.anyName();
    private String roadAddressName = PlaceFixture.anyRoadAddressName();
    private String addressName = PlaceFixture.anyAddressName();
    private Double longitude = PlaceFixture.anyLongitude();
    private Double latitude = PlaceFixture.anyLatitude();
    private int stayDurationMinutes = PlaceFixture.anyStayDurationMinutes();
    private LocalTime openAt = PlaceFixture.anyOpenAt();
    private LocalTime closeAt = PlaceFixture.anyCloseAt();
    private LocalTime breakStartAt = PlaceFixture.anyBreakStartAt();
    private LocalTime breakEndAt = PlaceFixture.anyBreakEndAt();
    private RoutieSpace routieSpace = PlaceFixture.anyRoutieSpace();
    private List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks = PlaceFixture.anyPlaceClosedDayOfWeeks();

    public PlaceBuilder name(final String name) {
        this.name = name;
        return this;
    }

    public PlaceBuilder roadAddressName(final String roadAddressName) {
        this.roadAddressName = roadAddressName;
        return this;
    }

    public PlaceBuilder addressName(final String addressName) {
        this.addressName = addressName;
        return this;
    }

    public PlaceBuilder longitude(final Double longitude) {
        this.longitude = longitude;
        return this;
    }

    public PlaceBuilder latitude(final Double latitude) {
        this.latitude = latitude;
        return this;
    }

    public PlaceBuilder stayDurationMinutes(final int stayDurationMinutes) {
        this.stayDurationMinutes = stayDurationMinutes;
        return this;
    }

    public PlaceBuilder openAt(final LocalTime openAt) {
        this.openAt = openAt;
        return this;
    }

    public PlaceBuilder closeAt(final LocalTime closeAt) {
        this.closeAt = closeAt;
        return this;
    }

    public PlaceBuilder breakStartAt(final LocalTime breakStartAt) {
        this.breakStartAt = breakStartAt;
        return this;
    }

    public PlaceBuilder breakEndAt(final LocalTime breakEndAt) {
        this.breakEndAt = breakEndAt;
        return this;
    }

    public PlaceBuilder routieSpace(final RoutieSpace routieSpace) {
        this.routieSpace = routieSpace;
        return this;
    }

    public PlaceBuilder placeClosedDayOfWeeks(final List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks) {
        this.placeClosedDayOfWeeks = placeClosedDayOfWeeks;
        return this;
    }

    public PlaceBuilder placeClosedDayOfWeeksByDayOfWeeks(final List<DayOfWeek> closedDayOfWeeeks) {
        this.placeClosedDayOfWeeks = closedDayOfWeeeks.stream()
                .map(PlaceClosedDayOfWeek::new)
                .toList();
        return this;
    }

    public Place build() {
        return new Place(
                name,
                roadAddressName,
                addressName,
                longitude,
                latitude,
                stayDurationMinutes,
                openAt,
                closeAt,
                breakStartAt,
                breakEndAt,
                routieSpace,
                placeClosedDayOfWeeks
        );
    }
}
