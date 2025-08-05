package routie.place.domain;

import routie.place.infrastructure.search.KakaoPlaceSearchResponse.Document;

public record SearchedPlace(
        String id,
        String placeName,
        String roadAddressName,
        double longitude,
        double latitude
) {

    public static SearchedPlace from(final Document document) {
        return new SearchedPlace(
                document.id(),
                document.place_name(),
                document.road_address_name(),
                document.x(),
                document.y()
        );
    }
}
