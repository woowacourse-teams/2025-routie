package routie.place.domain;

public record SearchedPlace(
        String id,
        String placeName,
        String roadAddressName,
        Double longitude,
        Double latitude
) {
}
