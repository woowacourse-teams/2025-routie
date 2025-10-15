package routie.business.place.ui.dto.response;

import java.util.List;
import routie.business.place.domain.Place;

public record PlaceListResponseV2(
        List<PlaceCardResponseV2> places
) {
    public static PlaceListResponseV2 from(final List<Place> places) {
        final List<PlaceCardResponseV2> placeCardResponses = places.stream()
                .map(place -> PlaceCardResponseV2.createPlaceWithLikeCount(place, 0L))
                .toList();

        return new PlaceListResponseV2(placeCardResponses);
    }

    public record PlaceCardResponseV2(
            Long id,
            String name,
            String roadAddressName,
            String addressName,
            Double longitude,
            Double latitude,
            Long likeCount
    ) {
        public static PlaceCardResponseV2 createPlaceWithLikeCount(final Place place, final Long likeCount) {
            return new PlaceCardResponseV2(
                    place.getId(),
                    place.getName(),
                    place.getRoadAddressName(),
                    place.getAddressName(),
                    place.getLongitude(),
                    place.getLatitude(),
                    likeCount
            );
        }
    }
}
