package routie.place.domain;

import routie.exception.BusinessException;
import routie.exception.ErrorCode;

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
            throw new BusinessException(ErrorCode.SEARCHED_PLACE_ID_REQUIRED);
        }
    }

    private void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new BusinessException(ErrorCode.SEARCHED_PLACE_NAME_REQUIRED);
        }
    }

    private void validateAddressName(final String addressName) {
        if (addressName == null || addressName.isBlank()) {
            throw new BusinessException(ErrorCode.SEARCHED_PLACE_ADDRESS_REQUIRED);
        }
    }

    private void validateLongitude(final double longitude) {
        if (longitude < -180 || longitude > 180) {
            throw new BusinessException(ErrorCode.SEARCHED_PLACE_LONGITUDE_INVALID);
        }
    }

    private void validateLatitude(final double latitude) {
        if (latitude < -90 || latitude > 90) {
            throw new BusinessException(ErrorCode.SEARCHED_PLACE_LATITUDE_INVALID);
        }
    }
}
