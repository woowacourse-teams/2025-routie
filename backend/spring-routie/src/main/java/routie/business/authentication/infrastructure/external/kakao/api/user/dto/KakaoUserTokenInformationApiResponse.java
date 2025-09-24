package routie.business.authentication.infrastructure.external.kakao.api.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoUserTokenInformationApiResponse(
        @JsonProperty("id") Long kakaoId
) {
}
