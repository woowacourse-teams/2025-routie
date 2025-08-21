package routie.place.domain;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import routie.routiespace.domain.RoutieSpace;

public class PlaceBuilder {

    private String name = "Default Place Name";
    private String roadAddressName = "Default Road Address";
    private String addressName = "Default Address";
    private Double longitude = 127.0;
    private Double latitude = 37.504497373023206;
    private int stayDurationMinutes = 60;
    private LocalTime openAt = LocalTime.of(0, 0);
    private LocalTime closeAt = LocalTime.of(23, 59);
    private LocalTime breakStartAt = null;
    private LocalTime breakEndAt = null;
    private RoutieSpace routieSpace = null;
    private List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks = new ArrayList<>();

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
