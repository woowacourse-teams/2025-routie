package routie.place.domain;

public record SearchedPlace(
        String searchedPlaceId,
        String name,
        String addressName,
        String roadAddressName,
        double longitude,
        double latitude
) {

    public SearchedPlace {
        validateSearchedPlaceId(searchedPlaceId);
        validateName(name);
        validateAddressName(addressName);
        validateLongitude(longitude);
        validateLatitude(latitude);
    }

    private void validateSearchedPlaceId(final String searchedPlaceId) {
        if (searchedPlaceId == null || searchedPlaceId.isBlank()) {
            throw new IllegalArgumentException("검색된 장소 ID는 필수값입니다.");
        }
    }

    private void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("장소 이름은 필수값입니다.");
        }
    }

    private void validateAddressName(final String addressName) {
        if (addressName == null || addressName.isBlank()) {
            throw new IllegalArgumentException("지번은 필수값입니다.");
        }
    }

    private void validateLongitude(final double longitude) {
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("유효한 경도 값이 아닙니다.");
        }
    }

    private void validateLatitude(final double latitude) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("유효한 위도 값이 아닙니다.");
        }
    }
}
