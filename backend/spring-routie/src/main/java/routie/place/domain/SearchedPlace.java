package routie.place.domain;

public record SearchedPlace(
        String id,
        String placeName,
        String roadAddressName,
        String longitude,
        String latitude
) {
}
