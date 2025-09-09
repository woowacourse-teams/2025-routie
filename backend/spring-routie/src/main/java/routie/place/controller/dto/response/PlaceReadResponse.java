package routie.place.controller.dto.response;

import routie.place.domain.Place;

public record PlaceReadResponse(
        String name,
        String roadAddressName,
        String addressName,
        Double longitude,
        Double latitude
) {

    public static PlaceReadResponse from(final Place place) {
        return new PlaceReadResponse(
                place.getName(),
                place.getRoadAddressName(),
                place.getAddressName(),
                place.getLongitude(),
                place.getLatitude()
        );
    }
}
