package routie.business.routie.ui.dto.sse;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.business.routie.ui.dto.response.RoutieReadResponse;

import java.util.List;

public record SseRoutieUpdateResponse(
        @JsonProperty("routiePlaces") List<SseRoutiePlaceResponse> routiePlaces
) {
    public static SseRoutieUpdateResponse from(
            final RoutieReadResponse routieReadResponse
    ) {
        return new SseRoutieUpdateResponse(
                routieReadResponse.routiePlaces().stream()
                        .map(routiePlaceResponse -> new SseRoutiePlaceResponse(
                                routiePlaceResponse.id(),
                                routiePlaceResponse.sequence(),
                                routiePlaceResponse.placeId()
                        ))
                        .toList()
        );
    }

    public record SseRoutiePlaceResponse(
            Long id,
            int sequence,
            Long placeId
    ) {
    }
}
