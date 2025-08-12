package routie.place.controller.dto.response;

import java.util.List;
import routie.place.domain.SearchedPlace;

public record SearchedPlacesResponse(
        List<SearchedPlaceResponse> searchedPlaces
) {

    public static SearchedPlacesResponse from(final List<SearchedPlace> searchedPlaces) {
        return new SearchedPlacesResponse(
                searchedPlaces.stream()
                        .map(SearchedPlaceResponse::from)
                        .toList()
        );
    }

    public record SearchedPlaceResponse(
            String searchedPlaceId,
            String name,
            String roadAddressName,
            String addressName,
            Double longitude,
            Double latitude
    ) {

        public static SearchedPlaceResponse from(final SearchedPlace searchedPlace) {
            return new SearchedPlaceResponse(
                    searchedPlace.searchedPlaceId(),
                    searchedPlace.name(),
                    searchedPlace.roadAddressName(),
                    searchedPlace.addressName(),
                    searchedPlace.longitude(),
                    searchedPlace.latitude()
            );
        }
    }
}
