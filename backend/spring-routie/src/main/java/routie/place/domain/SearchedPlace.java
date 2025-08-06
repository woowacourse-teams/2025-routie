package routie.place.domain;

public record SearchedPlace(
        String id,
        String placeName,
        String roadAddressName,
        double longitude,
        double latitude
) {
}
