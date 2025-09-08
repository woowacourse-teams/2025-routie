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
    private RoutieSpace routieSpace = PlaceFixture.anyRoutieSpace();

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

    public PlaceBuilder routieSpace(final RoutieSpace routieSpace) {
        this.routieSpace = routieSpace;
        return this;
    }

    public Place build() {
        return new Place(
                name,
                roadAddressName,
                addressName,
                longitude,
                latitude,
                routieSpace
        );
    }
}
