package routie.place.domain;

public record SearchedPlace(
        String searchedPlaceId,
        String name,
        String addressName,
        String roadAddressName,
        Double longitude,
        Double latitude
) {
}
