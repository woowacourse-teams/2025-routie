package routie.business.place.ui.dto.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.business.place.ui.dto.response.PlaceListResponseV3;

import java.util.List;

public record SsePlaceUpdateResponse(
        @JsonProperty("updatedPlaceId") Long updatedPlaceId,
        @JsonProperty("places") List<SsePlaceResponse> ssePlaceResponses
) {

    public static SsePlaceUpdateResponse createWithPlaceListResponseV2(
            final Long updatedPlaceId,
            final PlaceListResponseV3 placeListResponseV3
    ) {
        final List<SsePlaceResponse> ssePlaceResponses = placeListResponseV3.places().stream()
                .map(placeCardResponseV3 -> new SsePlaceResponse(
                        placeCardResponseV3.id(),
                        placeCardResponseV3.name(),
                        placeCardResponseV3.roadAddressName(),
                        placeCardResponseV3.addressName(),
                        placeCardResponseV3.longitude(),
                        placeCardResponseV3.latitude(),
                        placeCardResponseV3.likeCount(),
                        placeCardResponseV3.kakaoPlaceId(),
                        placeCardResponseV3.hashtags()
                ))
                .toList();

        return new SsePlaceUpdateResponse(updatedPlaceId, ssePlaceResponses);
    }

    public record SsePlaceResponse(
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
    }
}
