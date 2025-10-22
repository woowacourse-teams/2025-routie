package routie.business.place.ui.dto.event;

import java.util.List;

public record SsePlaceResponse(
        Long id,
        String name,
        String roadAddressName,
        String addressName,
        Double longitude,
        Double latitude,
        Long likeCount,
        List<String> hashtags
) {
}
