package routie.business.authentication.infrastructure.external.kakao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import routie.business.authentication.domain.external.ExternalAuthenticationProcessor;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.authentication.infrastructure.external.kakao.api.auth.KakaoExternalAuthenticationApiClient;
import routie.business.authentication.infrastructure.external.kakao.api.auth.dto.response.KakaoExternalAuthenticationTokenApiResponse;
import routie.business.authentication.infrastructure.external.kakao.api.user.KakaoUserApiClient;

@Component
public class KakaoExternalAuthenticationProcessor implements ExternalAuthenticationProcessor {

    private final String clientId;
    private final String redirectUri;
    private final KakaoExternalAuthenticationApiClient kakaoExternalAuthenticationApiClient;
    private final KakaoUserApiClient kakaoUserApiClient;

    public KakaoExternalAuthenticationProcessor(
            @Value("${authentication.external.kakao.client-id}") final String clientId,
            @Value("${authentication.external.kakao.redirect-uri}") final String redirectUri,
            final KakaoExternalAuthenticationApiClient kakaoExternalAuthenticationApiClient,
            final KakaoUserApiClient kakaoUserApiClient
    ) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.kakaoExternalAuthenticationApiClient = kakaoExternalAuthenticationApiClient;
        this.kakaoUserApiClient = kakaoUserApiClient;
    }

    @Override
    public String getAuthorizationUri() {
        return UriComponentsBuilder.fromUriString("https://kauth.kakao.com/oauth/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .build()
                .toUriString();
    }

    @Override
    public String getAuthenticationIdentifier(final String authenticationCode) {
        KakaoExternalAuthenticationTokenApiResponse kakaoExternalAuthenticationTokenApiResponse = kakaoExternalAuthenticationApiClient.getToken(
                authenticationCode);
        return kakaoUserApiClient.getTokenInformation(kakaoExternalAuthenticationTokenApiResponse.accessToken())
                .kakaoId().toString();
    }

    @Override
    public ExternalAuthenticationProvider getExternalAuthenticationProvider() {
        return ExternalAuthenticationProvider.KAKAO;
    }
}
