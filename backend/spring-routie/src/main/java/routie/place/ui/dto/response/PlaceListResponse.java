package routie.place.ui.dto.response;

import java.util.List;
import routie.place.domain.Place;

public record PlaceListResponse(
        List<PlaceCardResponse> places
) {

    public static PlaceListResponse from(final List<Place> places) {
        List<PlaceCardResponse> placeCardResponses = places.stream()
                .map(PlaceCardResponse::from)
                .toList();

        return new PlaceListResponse(placeCardResponses);
    }

    public record PlaceCardResponse(
            Long id,
            String name,
            String roadAddressName,
            String addressName,
            Double longitude,
            Double latitude
    ) {
        public static PlaceCardResponse from(final Place place) {
            return new PlaceCardResponse(
                    place.getId(),
                    place.getName(),
                    place.getRoadAddressName(),
                    place.getAddressName(),
                    place.getLongitude(),
                    place.getLatitude()
            );
        }
    }
}
