package routie.business.authentication.infrastructure.external.kakao.api.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import routie.business.authentication.infrastructure.external.kakao.api.auth.dto.response.KakaoExternalAuthenticationTokenApiResponse;

@RequiredArgsConstructor
public class KakaoExternalAuthenticationApiClient {

    private final String clientId;
    private final String redirect_uri;
    private final RestClient restClient;

    public KakaoExternalAuthenticationTokenApiResponse getToken(final String code) {
        return restClient.post()
                .uri("/token?grant_type={grantType}&client_id={clientId}&code={code}&redirect_uri={redirectUri}",
                        "authorization_code", clientId, code, redirect_uri)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .retrieve()
                .body(KakaoExternalAuthenticationTokenApiResponse.class);
    }
}
