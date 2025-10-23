package routie.business.authentication.infrastructure.external.kakao.api.auth.config.error.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoExternalAuthenticationApiErrorResponse(
        @JsonProperty("error_code") String errorCode
) {
}
