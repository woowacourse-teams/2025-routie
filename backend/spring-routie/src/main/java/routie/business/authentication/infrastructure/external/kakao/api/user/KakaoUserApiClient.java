package routie.business.authentication.infrastructure.external.kakao.api.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;
import routie.business.authentication.infrastructure.external.kakao.api.user.dto.KakaoUserTokenInformationApiResponse;

@RequiredArgsConstructor
public class KakaoUserApiClient {

    private final RestClient restClient;

    public KakaoUserTokenInformationApiResponse getTokenInformation(final String accessToken) {
        return restClient.get()
                .uri("/access_token_info")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(KakaoUserTokenInformationApiResponse.class);
    }
}
