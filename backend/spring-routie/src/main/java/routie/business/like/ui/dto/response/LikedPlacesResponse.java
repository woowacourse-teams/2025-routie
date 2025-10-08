package routie.business.like.ui.dto.response;

import java.util.List;
import routie.business.like.domain.PlaceLike;

public record LikedPlacesResponse(
        List<Long> likedPlaceIds
) {
    public static LikedPlacesResponse from(final List<PlaceLike> placeLikes) {
        return new LikedPlacesResponse(
                placeLikes.stream()
                        .map(placeLike -> placeLike.getPlace().getId())
                        .toList()
        );
    }
}
