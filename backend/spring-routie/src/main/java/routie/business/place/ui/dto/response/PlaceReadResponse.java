package routie.business.place.ui.dto.response;

import java.util.List;
import routie.business.hashtag.domain.Hashtag;
import routie.business.place.domain.Place;

public record PlaceReadResponse(
        String name,
        String roadAddressName,
        String addressName,
        Double longitude,
        Double latitude,
        List<String> hashtags
) {

    public static PlaceReadResponse from(final Place place) {
        final List<String> hashtagNames = place.getHashtags().stream()
                .map(Hashtag::getName)
                .toList();

        return new PlaceReadResponse(
                place.getName(),
                place.getRoadAddressName(),
                place.getAddressName(),
                place.getLongitude(),
                place.getLatitude(),
                hashtagNames
        );
    }
}
