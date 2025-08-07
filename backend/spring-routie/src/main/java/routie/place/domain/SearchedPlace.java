package routie.place.domain;

public record SearchedPlace(
        String id,
        String name,
        String roadAddressName,
        Double longitude,
        Double latitude
) {
}
