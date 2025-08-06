package routie.place.controller.dto.response;

import java.util.List;
import routie.place.domain.SearchedPlace;

public record SearchedPlacesResponse(
        List<SearchedPlaceResponse> searchPlaces
) {

    public static SearchedPlacesResponse from(final List<SearchedPlace> searchedPlaces) {
        return new SearchedPlacesResponse(
                searchedPlaces.stream()
                        .map(SearchedPlaceResponse::from)
                        .toList()
        );
    }

    public record SearchedPlaceResponse(
            String id,
            String placeName,
            String roadAddressName,
            Double longitude,
            Double latitude
    ) {

        public static SearchedPlaceResponse from(final SearchedPlace searchedPlace) {
            return new SearchedPlaceResponse(
                    searchedPlace.id(),
                    searchedPlace.placeName(),
                    searchedPlace.roadAddressName(),
                    searchedPlace.longitude(),
                    searchedPlace.latitude()
            );
        }
    }
}
