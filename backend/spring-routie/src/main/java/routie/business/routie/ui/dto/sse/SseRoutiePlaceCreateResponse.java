package routie.business.routie.ui.dto.sse;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.business.routie.ui.dto.response.RoutieReadResponse;

import java.util.List;

public record SseRoutiePlaceCreateResponse(
        @JsonProperty("createdRoutiePlaceId") Long createdRoutiePlaceId,
        @JsonProperty("routiePlaces") List<SseRoutiePlaceResponse> routiePlaces
) {
    public static SseRoutiePlaceCreateResponse createWithRoutieReadResponse(
            final Long createdRoutiePlaceId,
            final RoutieReadResponse routieReadResponse
    ) {
        return new SseRoutiePlaceCreateResponse(
                createdRoutiePlaceId,
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

