package routie.place.infrastructure.search.kakao.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoPlaceSearchApiErrorResponse(
        @JsonProperty("errorType") String errorType,
        @JsonProperty("message") String message
) {

    public boolean isQuotaExceeded() {
        return errorType.equals("RequestThrottled");
    }
}
