package routie.business.authentication.infrastructure.external.kakao.api.user.config.error.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoUserApiErrorResponse(
        @JsonProperty("msg") String message,
        @JsonProperty("code") String code
) {
}
