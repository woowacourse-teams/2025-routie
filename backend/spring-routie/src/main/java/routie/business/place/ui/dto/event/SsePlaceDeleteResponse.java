package routie.business.place.ui.dto.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.business.place.ui.dto.response.PlaceListResponseV2;

import java.util.List;

public record SsePlaceDeleteResponse(
        @JsonProperty("deletedPlaceId") Long deletedPlaceId,
        @JsonProperty("places") List<SsePlaceResponse> ssePlaceResponses
) {

    public static SsePlaceDeleteResponse createWithPlaceListResponseV2(
            final Long updatedPlaceId,
            final PlaceListResponseV2 placeListResponseV2
    ) {
        final List<SsePlaceResponse> ssePlaceResponses = placeListResponseV2.places().stream()
                .map(placeCardResponseV2 -> new SsePlaceResponse(
                        placeCardResponseV2.id(),
                        placeCardResponseV2.name(),
                        placeCardResponseV2.roadAddressName(),
                        placeCardResponseV2.addressName(),
                        placeCardResponseV2.longitude(),
                        placeCardResponseV2.latitude(),
                        placeCardResponseV2.likeCount(),
                        placeCardResponseV2.hashtags()
                ))
                .toList();

        return new SsePlaceDeleteResponse(updatedPlaceId, ssePlaceResponses);
    }

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
}
