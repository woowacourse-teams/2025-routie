package routie.business.place.domain;

import routie.business.routiespace.domain.RoutieSpace;

public class PlaceBuilder {

    private String name = PlaceFixture.anyName();
    private String roadAddressName = PlaceFixture.anyRoadAddressName();
    private String addressName = PlaceFixture.anyAddressName();
    private Double longitude = PlaceFixture.anyLongitude();
    private Double latitude = PlaceFixture.anyLatitude();
    private String kakaoPlaceId = PlaceFixture.anyKakaoPlaceId();
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

    public PlaceBuilder kakaoPlaceId(final String kakaoPlaceId) {
        this.kakaoPlaceId = kakaoPlaceId;
        return this;
    }

    public PlaceBuilder routieSpace(final RoutieSpace routieSpace) {
        this.routieSpace = routieSpace;
        return this;
    }

    public Place build() {
        return new Place(name, roadAddressName, addressName, longitude, latitude, kakaoPlaceId, routieSpace);
    }
}
