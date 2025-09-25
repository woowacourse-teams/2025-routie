package routie.business.authentication.infrastructure.external.kakao.api.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import routie.business.authentication.infrastructure.external.kakao.api.auth.dto.response.KakaoExternalAuthenticationTokenApiResponse;

@RequiredArgsConstructor
public class KakaoExternalAuthenticationApiClient {

    private final String clientId;
    private final String redirect_uri;
    private final RestClient restClient;

    public KakaoExternalAuthenticationTokenApiResponse getToken(final String code) {
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("client_id", clientId);
        requestBody.add("code", code);
        requestBody.add("redirect_uri", redirect_uri);

        return restClient.post()
                .uri("/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(requestBody)
                .retrieve()
                .body(KakaoExternalAuthenticationTokenApiResponse.class);
    }
}
