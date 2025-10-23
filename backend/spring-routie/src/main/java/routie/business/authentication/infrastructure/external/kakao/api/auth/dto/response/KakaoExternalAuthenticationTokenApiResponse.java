package routie.business.authentication.infrastructure.external.kakao.api.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoExternalAuthenticationTokenApiResponse(
        @JsonProperty("access_token") String accessToken
) {
}
