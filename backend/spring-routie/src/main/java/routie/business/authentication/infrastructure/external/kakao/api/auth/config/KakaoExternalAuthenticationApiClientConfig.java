package routie.business.authentication.infrastructure.external.kakao.api.auth.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import routie.business.authentication.infrastructure.external.kakao.api.auth.KakaoExternalAuthenticationApiClient;
import routie.business.authentication.infrastructure.external.kakao.api.auth.config.error.KakaoExternalAuthenticationApiErrorHandler;

@Configuration
public class KakaoExternalAuthenticationApiClientConfig {

    private final String clientId;
    private final String redirectUri;
    private final KakaoExternalAuthenticationApiErrorHandler kakaoExternalAuthenticationApiErrorHandler;

    public KakaoExternalAuthenticationApiClientConfig(
            @Value("${authentication.external.kakao.client-id}") final String clientId,
            @Value("${authentication.external.kakao.redirect-uri}") final String redirectUri,
            final KakaoExternalAuthenticationApiErrorHandler kakaoExternalAuthenticationApiErrorHandler
    ) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.kakaoExternalAuthenticationApiErrorHandler = kakaoExternalAuthenticationApiErrorHandler;
    }

    @Bean
    public KakaoExternalAuthenticationApiClient kakaoExternalAuthenticationApiClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(4));

        RestClient restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl("https://kauth.kakao.com/oauth")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .defaultStatusHandler(kakaoExternalAuthenticationApiErrorHandler)
                .build();

        return new KakaoExternalAuthenticationApiClient(clientId, redirectUri, restClient);
    }
}
