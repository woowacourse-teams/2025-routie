package routie.business.place.ui.dto.response;

import routie.business.hashtag.domain.Hashtag;
import routie.business.place.domain.Place;

import java.util.List;

public record PlaceListResponseV3(
        List<PlaceCardResponseV3> places
) {
    public static PlaceListResponseV3 from(final List<Place> places) {
        final List<PlaceCardResponseV3> placeCardResponses = places.stream()
                .map(place -> PlaceCardResponseV3.createPlaceWithLikeCount(place, 0L))
                .toList();

        return new PlaceListResponseV3(placeCardResponses);
    }

    public record PlaceCardResponseV3(
            Long id,
            String name,
            String roadAddressName,
            String addressName,
            Double longitude,
            Double latitude,
            Long likeCount,
            String kakaoPlaceId,
            List<String> hashtags
    ) {
        public static PlaceCardResponseV3 createPlaceWithLikeCount(final Place place, final Long likeCount) {
            final List<String> hashTagNames = place.getHashtags().stream()
                    .map(Hashtag::getName)
                    .toList();

            return new PlaceCardResponseV3(
                    place.getId(),
                    place.getName(),
                    place.getRoadAddressName(),
                    place.getAddressName(),
                    place.getLongitude(),
                    place.getLatitude(),
                    likeCount,
                    place.getKakaoPlaceId(),
                    hashTagNames
            );
        }
    }
}
