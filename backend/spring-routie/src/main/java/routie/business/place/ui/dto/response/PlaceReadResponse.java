package routie.business.place.ui.dto.response;

import java.util.List;
import routie.business.place.domain.Hashtag;
import routie.business.place.domain.Place;

public record PlaceReadResponse(
        String name,
        String roadAddressName,
        String addressName,
        Double longitude,
        Double latitude,
        List<String> hashTags
) {

    public static PlaceReadResponse from(final Place place) {
        List<String> hashTagNames = place.getHashtags().stream()
                .map(Hashtag::getName)
                .toList();

        return new PlaceReadResponse(
                place.getName(),
                place.getRoadAddressName(),
                place.getAddressName(),
                place.getLongitude(),
                place.getLatitude(),
                hashTagNames
        );
    }
}
